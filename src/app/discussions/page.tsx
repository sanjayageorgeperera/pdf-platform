import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic';

export default async function DiscussionsPage() {
  const supabase = await createClient()

  // Fetch latest 10 reviews
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*, documents(id, title), profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="container mt-8 animate-fade-in" style={{ maxWidth: '800px', paddingBottom: '4rem' }}>
      <header className="mb-8 text-center">
        <h1 className="mb-2">Community Discussions</h1>
        <p style={{ opacity: 0.7 }}>See what our readers are saying about recent PDFs and join the conversation!</p>
      </header>

      {/* Ad Space */}
      <div className="card mb-8 text-center" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderStyle: 'dashed' }}>
        <p style={{ opacity: 0.5, fontSize: '0.875rem' }}>Discussion Thread Advertisement Space</p>
      </div>

      {error && <p style={{ color: 'var(--danger)' }}>Failed to load discussions.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {reviews && reviews.length > 0 ? (
          reviews.map((rev) => (
            <div 
              key={rev.id} 
              className="card" 
              style={{ 
                borderLeft: '3px solid var(--accent)',
                padding: '1.5rem',
                background: 'rgba(255,255,255,0.02)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <strong style={{ fontSize: '1rem', color: 'white' }}>{rev.profiles?.full_name || 'Anonymous User'}</strong>
                  <span style={{ fontSize: '0.85rem', opacity: 0.5, marginLeft: '0.5rem' }}>
                    reviewed <strong style={{ color: 'var(--accent)' }}>{rev.documents?.title}</strong>
                  </span>
                </div>
                <span style={{ color: 'var(--accent)' }}>
                  {'⭐'.repeat(rev.rating)}
                </span>
              </div>

              <p style={{ opacity: 0.85, fontSize: '0.925rem', lineHeight: '1.5', whiteSpace: 'pre-line', marginBottom: '1.25rem' }}>
                "{rev.comment_text}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ opacity: 0.4 }}>{new Date(rev.created_at).toLocaleDateString()}</span>
                <Link 
                  href={`/pdfs/${rev.documents?.id}`} 
                  style={{ 
                    color: 'var(--primary)', 
                    textDecoration: 'none', 
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  className="hover:opacity-80"
                >
                  Join Discussion & Read PDF →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-8">
            <p style={{ opacity: 0.5 }}>No discussions started yet. Be the first to read a PDF and leave a review!</p>
          </div>
        )}
      </div>
    </div>
  )
}
