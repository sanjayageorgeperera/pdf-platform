import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { addReview, deleteDocument, deleteReview, deleteQuiz } from './actions'
import Link from 'next/link'

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function PdfViewerPage({ params, searchParams }: PageProps) {
  const supabase = await createClient()
  const { id } = await params
  const { error: errorParam, message: messageParam } = await searchParams

  // Fetch current user
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch document details
  const { data: document, error } = await supabase
    .from('documents')
    .select('*, profiles(full_name)')
    .eq('id', id)
    .single()

  if (error || !document) {
    redirect('/pdfs')
  }

  // Increment view_count inside the database
  await supabase
    .from('documents')
    .update({ view_count: (document.view_count || 0) + 1 })
    .eq('id', id)
  
  // Update local document object view count so it reflects on page load immediately!
  document.view_count = (document.view_count || 0) + 1

  // Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profiles(full_name)')
    .eq('document_id', id)
    .order('created_at', { ascending: false })

  // Fetch quiz if it exists
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id')
    .eq('document_id', id)
    .maybeSingle()

  // Fetch user role
  let userRole = 'user'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    userRole = profile?.role?.trim().toLowerCase() || 'user'
  }

  // We should ideally increment view_count here or via an API route
  // For simplicity, we just display it.

  const deleteDocAction = deleteDocument.bind(null, id)

  return (
    <div className="container mt-8 animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <Link href="/pdfs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem', textDecoration: 'none', fontSize: '0.875rem', opacity: 0.6 }} className="hover:opacity-100 transition-opacity">
        ← Back to Explore
      </Link>
      <header className="mb-6">
        <h1 className="mb-2">{document.title}</h1>
        <div className="flex gap-4 items-center" style={{ opacity: 0.7, fontSize: '0.875rem', flexWrap: 'wrap' }}>
          <span 
            style={{ 
              fontSize: '0.775rem', 
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)', 
              color: 'white', 
              padding: '0.3rem 0.8rem', 
              borderRadius: '999px',
              fontWeight: 700,
              boxShadow: '0 2px 8px -2px rgba(139, 92, 246, 0.5)',
              letterSpacing: '0.5px'
            }}
          >
            {document.category || 'General'}
          </span>
          <span 
            style={{ 
              fontSize: '0.775rem', 
              background: 'rgba(255,255,255,0.08)', 
              color: 'rgba(255,255,255,0.85)', 
              padding: '0.3rem 0.8rem', 
              borderRadius: '999px',
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.05)',
              letterSpacing: '0.5px'
            }}
          >
            🌐 {document.language || 'English'}
          </span>
          <span>•</span>
          <span>Uploaded by: {document.profiles?.full_name || 'Anonymous'}</span>
          <span>•</span>
          <span>Views: {document.view_count}</span>
          <span>•</span>
          <a href={document.file_url} download className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
            Download File
          </a>
          <span>•</span>
          {quiz ? (
            <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link href={`/pdfs/${id}/quiz`} className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', textDecoration: 'none' }}>
                Take Quiz & Earn Points! 🏆
              </Link>
              {userRole === 'admin' && (
                <form action={deleteQuiz.bind(null, id, quiz.id)} style={{ display: 'inline' }}>
                  <button 
                    type="submit" 
                    className="btn btn-secondary" 
                    style={{ 
                      padding: '0.25rem 0.5rem', 
                      fontSize: '0.75rem', 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      color: 'var(--danger)',
                      border: '1px solid var(--danger)',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete Quiz 🗑️
                  </button>
                </form>
              )}
            </div>
          ) : (
            userRole === 'admin' && (
              <Link href={`/pdfs/${id}/quiz/create`} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', textDecoration: 'none', border: '1px dashed var(--accent)', color: 'var(--accent)' }}>
                Create Quiz 📝
              </Link>
            )
          )}
          {userRole === 'admin' && (
            <>
              <span>•</span>
              <form action={deleteDocAction} style={{ display: 'inline' }}>
                <button 
                  type="submit" 
                  className="btn" 
                  style={{ 
                    padding: '0.25rem 0.5rem', 
                    fontSize: '0.75rem', 
                    background: 'var(--danger)', 
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete PDF 🗑️
                </button>
              </form>
            </>
          )}
        </div>
      </header>

      {document.description && (
        <div className="card mb-8">
          <h3 className="mb-2" style={{ fontSize: '1rem' }}>Description</h3>
          <p style={{ opacity: 0.8 }}>{document.description}</p>
        </div>
      )}

      {/* Ad Space before content */}
      <div className="mb-8 text-center" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderStyle: 'dashed' }}>
        <p style={{ opacity: 0.5, fontSize: '0.875rem' }}>Top Advertisement Space</p>
      </div>

      {/* Responsive PDF Viewer */}
      <div className="pdf-viewer-desktop">
        <div className="card mb-8" style={{ padding: 0, overflow: 'hidden', height: '80vh', border: '1px solid rgba(255,255,255,0.1)' }}>
          <object 
            data={document.file_url} 
            type="application/pdf" 
            width="100%" 
            height="100%"
          >
            <div className="flex justify-center items-center h-full" style={{ padding: '2rem', textAlign: 'center' }}>
              <div>
                <p className="mb-4">It appears your browser does not support built-in PDF viewing.</p>
                <a href={document.file_url} className="btn btn-primary" target="_blank" rel="noreferrer">
                  Download the PDF instead
                </a>
              </div>
            </div>
          </object>
        </div>
      </div>

      <div className="pdf-viewer-mobile">
        <div className="mobile-reader-card">
          <span className="mobile-reader-icon">📖</span>
          <h3 className="mobile-reader-title">Read PDF on Mobile</h3>
          <p className="mobile-reader-desc">
            For the best reading experience on Android and iPhone, open this PDF in a dedicated tab or download it directly to your device.
          </p>
          <div className="mobile-reader-actions">
            <a 
              href={document.file_url} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-primary"
            >
              Open PDF Reader ↗️
            </a>
            <a 
              href={document.file_url} 
              download 
              className="btn btn-secondary"
            >
              Download PDF 📥
            </a>
          </div>
        </div>
      </div>

      {/* Ad Space after content */}
      <div className="mb-8 text-center" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderStyle: 'dashed' }}>
        <p style={{ opacity: 0.5, fontSize: '0.875rem' }}>Bottom Advertisement Space</p>
      </div>
      
      {/* Review Section */}
      <section className="card mb-8">
        <h3 className="mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Reviews & Discussions</h3>

        {/* Display Success/Error messages */}
        {errorParam && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderLeft: '3px solid var(--danger)', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {errorParam}
          </div>
        )}
        {messageParam && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', borderLeft: '3px solid var(--success)', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {messageParam}
          </div>
        )}

        {/* Add Review Form */}
        {user ? (
          <form action={addReview} className="mb-8" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 className="mb-4" style={{ fontSize: '1rem', fontWeight: 600 }}>Write a Review</h4>
            <input type="hidden" name="document_id" value={id} />
            
            <div className="mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="rating" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Rating</label>
              <select 
                name="rating" 
                id="rating"
                required
                style={{ 
                  padding: '0.75rem', 
                  borderRadius: '6px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  background: 'rgba(255,255,255,0.05)', 
                  color: 'white',
                  width: '100%',
                  maxWidth: '200px'
                }}
              >
                <option value="5" style={{ background: '#121212' }}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value="4" style={{ background: '#121212' }}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value="3" style={{ background: '#121212' }}>⭐⭐⭐ (3 Stars)</option>
                <option value="2" style={{ background: '#121212' }}>⭐⭐ (2 Stars)</option>
                <option value="1" style={{ background: '#121212' }}>⭐ (1 Star)</option>
              </select>
            </div>

            <div className="mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="comment_text" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Comment / Discussion</label>
              <textarea 
                name="comment_text" 
                id="comment_text"
                required
                rows={4}
                placeholder="Share your thoughts about this PDF. Ask a question or start a discussion..."
                style={{ 
                  padding: '0.75rem', 
                  borderRadius: '6px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  background: 'rgba(255,255,255,0.05)', 
                  color: 'white',
                  width: '100%',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.875rem' }}>
              Submit Review
            </button>
          </form>
        ) : (
          <div className="mb-8 text-center" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="mb-4" style={{ opacity: 0.7 }}>You must be logged in to participate in the discussions.</p>
            <Link href="/login" className="btn btn-primary" style={{ display: 'inline-block', padding: '0.5rem 1.5rem', textDecoration: 'none' }}>
              Log In to Comment
            </Link>
          </div>
        )}

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews && reviews.length > 0 ? (
            reviews.map((rev: any) => (
              <div 
                key={rev.id} 
                style={{ 
                  padding: '1.25rem', 
                  borderRadius: '8px', 
                  background: 'rgba(255,255,255,0.01)', 
                  border: '1px solid rgba(255,255,255,0.03)' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {rev.profiles?.full_name || 'Anonymous User'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>
                      {'⭐'.repeat(rev.rating)}
                    </span>
                    {userRole === 'admin' && (
                      <form action={deleteReview.bind(null, id, rev.id)} style={{ display: 'inline' }}>
                        <button 
                          type="submit" 
                          className="btn" 
                          style={{ 
                            padding: '0.1rem 0.4rem', 
                            fontSize: '0.65rem', 
                            background: 'var(--danger)', 
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginLeft: '0.5rem'
                          }}
                        >
                          Delete Comment 🗑️
                        </button>
                      </form>
                    )}
                  </div>
                </div>
                <p style={{ opacity: 0.85, fontSize: '0.925rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                  {rev.comment_text}
                </p>
                <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.4 }}>
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center" style={{ opacity: 0.5, padding: '2rem' }}>No reviews yet. Be the first to start the discussion!</p>
          )}
        </div>
      </section>

    </div>
  )
}
