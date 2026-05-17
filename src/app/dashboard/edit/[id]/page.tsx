import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { editDocument } from '../../actions'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}

export default async function EditDocumentPage({ params, searchParams }: PageProps) {
  const supabase = await createClient()
  const { id } = await params
  const { error } = await searchParams

  // 1. Verify User Session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Fetch Document
  const { data: document } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single()

  if (!document) {
    redirect('/dashboard?error=Document not found')
  }

  // 3. Verify Ownership or Admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const userRole = profile?.role?.trim().toLowerCase()
  const isOwner = document.uploader_id === user.id

  if (userRole !== 'admin' && !isOwner) {
    redirect('/dashboard?error=You are not authorized to edit this document.')
  }

  const categories = [
    'Education & Academics',
    'Science & Technology',
    'Business & Finance',
    'Self-Development & Motivation',
    'Fiction & Novels',
    'History & Biography',
    'Health & Fitness',
    'Kids & Family',
    'Arts & Photography',
    'Computers & Programming',
    'Religious & Spiritual',
    'Lifestyle & Travel',
    'Law & Politics',
    'General'
  ]

  const languages = [
    'English',
    'Sinhala',
    'Tamil',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Hindi',
    'Arabic',
    'Russian',
    'Portuguese',
    'Bengali',
    'Japanese',
    'Korean',
    'Urdu',
    'Italian',
    'Turkish',
    'Vietnamese',
    'Other'
  ]

  return (
    <div className="container max-w-2xl mt-8 animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem', textDecoration: 'none', fontSize: '0.875rem', opacity: 0.6 }} className="hover:opacity-100 transition-opacity">
        ← Back to Dashboard
      </Link>
      
      <div className="card" style={{ padding: '2rem' }}>
        <h1 className="mb-6" style={{ fontSize: '1.75rem' }}>Edit PDF Details</h1>

        {error && (
          <div className="card mb-6" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--danger)', padding: '0.75rem 1rem' }}>
            <p style={{ color: 'var(--danger)', margin: 0, fontSize: '0.9rem' }}>{error}</p>
          </div>
        )}

        <form action={editDocument} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input type="hidden" name="document_id" value={document.id} />

          <div>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>PDF Title *</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              defaultValue={document.title} 
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Description</label>
            <textarea 
              id="description" 
              name="description" 
              defaultValue={document.description || ''} 
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: '0.95rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Category *</label>
              <select 
                id="category" 
                name="category" 
                defaultValue={document.category || 'General'}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.3)',
                  color: 'white',
                  fontSize: '0.95rem',
                  colorScheme: 'dark',
                  cursor: 'pointer'
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} style={{ background: '#111827', color: 'white' }}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="language" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Language *</label>
              <select 
                id="language" 
                name="language" 
                defaultValue={document.language || 'English'}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.3)',
                  color: 'white',
                  fontSize: '0.95rem',
                  colorScheme: 'dark',
                  cursor: 'pointer'
                }}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang} style={{ background: '#111827', color: 'white' }}>
                    {lang === 'Sinhala' ? 'Sinhala (සිංහල)' : lang === 'Tamil' ? 'Tamil (தமிழ்)' : lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem' }}>
              Save Changes
            </button>
            <Link href="/dashboard" className="btn btn-secondary" style={{ flex: 1, padding: '0.75rem', textAlign: 'center', textDecoration: 'none' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
