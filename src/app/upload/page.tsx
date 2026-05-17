import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { uploadPdf } from './actions'

export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { error } = await searchParams;

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login?message=You must be logged in to upload a PDF.')
  }

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Upload a PDF</h2>
        <p className="text-center mb-8" style={{ opacity: 0.7 }}>Share your knowledge with the community. Note: All files require admin approval before they are publicly visible.</p>
        
        <form action={uploadPdf} className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="title" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Document Title *</label>
            <input 
              id="title" 
              name="title" 
              type="text" 
              required 
              placeholder="e.g. Introduction to Next.js"
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="description" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows={3}
              placeholder="Briefly describe what this PDF is about..."
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="category" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Category *</label>
              <select
                id="category"
                name="category"
                required
                style={{ 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  background: 'rgba(0,0,0,0.3)', 
                  color: 'white',
                  fontFamily: 'inherit',
                  colorScheme: 'dark'
                }}
              >
                <option value="Education & Academics" style={{ background: '#111827', color: 'white' }}>Education & Academics</option>
                <option value="Science & Technology" style={{ background: '#111827', color: 'white' }}>Science & Technology</option>
                <option value="Business & Finance" style={{ background: '#111827', color: 'white' }}>Business & Finance</option>
                <option value="Self-Development & Motivation" style={{ background: '#111827', color: 'white' }}>Self-Development & Motivation</option>
                <option value="Fiction & Novels" style={{ background: '#111827', color: 'white' }}>Fiction & Novels</option>
                <option value="History & Biography" style={{ background: '#111827', color: 'white' }}>History & Biography</option>
                <option value="Health & Fitness" style={{ background: '#111827', color: 'white' }}>Health & Fitness</option>
                <option value="Kids & Family" style={{ background: '#111827', color: 'white' }}>Kids & Family</option>
                <option value="Arts & Photography" style={{ background: '#111827', color: 'white' }}>Arts & Photography</option>
                <option value="Computers & Programming" style={{ background: '#111827', color: 'white' }}>Computers & Programming</option>
                <option value="Religious & Spiritual" style={{ background: '#111827', color: 'white' }}>Religious & Spiritual</option>
                <option value="Lifestyle & Travel" style={{ background: '#111827', color: 'white' }}>Lifestyle & Travel</option>
                <option value="Law & Politics" style={{ background: '#111827', color: 'white' }}>Law & Politics</option>
                <option value="General" style={{ background: '#111827', color: 'white' }}>General</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="language" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Language *</label>
              <select
                id="language"
                name="language"
                required
                style={{ 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  background: 'rgba(0,0,0,0.3)', 
                  color: 'white',
                  fontFamily: 'inherit',
                  colorScheme: 'dark'
                }}
              >
                <option value="English" style={{ background: '#111827', color: 'white' }}>English</option>
                <option value="Sinhala" style={{ background: '#111827', color: 'white' }}>Sinhala (සිංහල)</option>
                <option value="Tamil" style={{ background: '#111827', color: 'white' }}>Tamil (தமிழ்)</option>
                <option value="Spanish" style={{ background: '#111827', color: 'white' }}>Spanish</option>
                <option value="French" style={{ background: '#111827', color: 'white' }}>French</option>
                <option value="German" style={{ background: '#111827', color: 'white' }}>German</option>
                <option value="Chinese" style={{ background: '#111827', color: 'white' }}>Chinese</option>
                <option value="Hindi" style={{ background: '#111827', color: 'white' }}>Hindi</option>
                <option value="Arabic" style={{ background: '#111827', color: 'white' }}>Arabic</option>
                <option value="Russian" style={{ background: '#111827', color: 'white' }}>Russian</option>
                <option value="Portuguese" style={{ background: '#111827', color: 'white' }}>Portuguese</option>
                <option value="Bengali" style={{ background: '#111827', color: 'white' }}>Bengali</option>
                <option value="Japanese" style={{ background: '#111827', color: 'white' }}>Japanese</option>
                <option value="Korean" style={{ background: '#111827', color: 'white' }}>Korean</option>
                <option value="Urdu" style={{ background: '#111827', color: 'white' }}>Urdu</option>
                <option value="Italian" style={{ background: '#111827', color: 'white' }}>Italian</option>
                <option value="Turkish" style={{ background: '#111827', color: 'white' }}>Turkish</option>
                <option value="Vietnamese" style={{ background: '#111827', color: 'white' }}>Vietnamese</option>
                <option value="Other" style={{ background: '#111827', color: 'white' }}>Other</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="pdf_file" style={{ fontSize: '0.875rem', fontWeight: 500 }}>PDF File *</label>
            <input 
              id="pdf_file" 
              name="pdf_file" 
              type="file" 
              accept="application/pdf"
              required 
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.1)', color: 'white' }}
            />
          </div>

          {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</p>}

          <button type="submit" className="btn btn-primary mt-4">Submit for Approval</button>
        </form>
      </div>
    </div>
  )
}
