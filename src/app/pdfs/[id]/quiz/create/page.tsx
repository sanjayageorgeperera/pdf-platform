import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createQuiz } from './actions'

export const dynamic = 'force-dynamic';

export default async function CreateQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  // Verify authentication and Admin role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role?.trim().toLowerCase() !== 'admin') {
    redirect('/')
  }

  // Fetch document info
  const { data: document } = await supabase
    .from('documents')
    .select('title')
    .eq('id', id)
    .single()

  if (!document) {
    redirect('/pdfs')
  }

  return (
    <div className="container mt-8 animate-fade-in" style={{ maxWidth: '800px', paddingBottom: '4rem' }}>
      <header className="mb-8">
        <h1 className="mb-2" style={{ fontSize: '2rem' }}>Create Quiz</h1>
        <p style={{ opacity: 0.7 }}>Define a 3-question quiz for: <strong style={{ color: 'var(--accent)' }}>{document.title}</strong></p>
      </header>

      <form action={createQuiz} className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
        <input type="hidden" name="document_id" value={id} />

        {/* Quiz Meta */}
        <div className="card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="quiz_title" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Quiz Title</label>
            <input 
              type="text" 
              name="quiz_title" 
              id="quiz_title" 
              placeholder="e.g., Quick Knowledge Check on Stock Market"
              required 
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white'
              }}
            />
          </div>
        </div>

        {/* 3 Questions Loop */}
        {[1, 2, 3].map((num) => (
          <div key={num} className="card" style={{ borderLeft: '3px solid var(--accent)' }}>
            <h3 className="mb-4" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Question {num}</h3>
            
            <div className="flex" style={{ flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', opacity: 0.8 }}>Question Text</label>
                <input 
                  type="text" 
                  name={`q${num}_text`} 
                  placeholder={`What is the main topic of Question ${num}?`}
                  required 
                  style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white'
                  }}
                />
              </div>

              {/* Options */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', opacity: 0.6 }}>Option 1</label>
                  <input 
                    type="text" 
                    name={`q${num}_opt1`} 
                    required 
                    style={{
                      padding: '0.6rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', opacity: 0.6 }}>Option 2</label>
                  <input 
                    type="text" 
                    name={`q${num}_opt2`} 
                    required 
                    style={{
                      padding: '0.6rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', opacity: 0.6 }}>Option 3</label>
                  <input 
                    type="text" 
                    name={`q${num}_opt3`} 
                    required 
                    style={{
                      padding: '0.6rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', opacity: 0.6 }}>Option 4</label>
                  <input 
                    type="text" 
                    name={`q${num}_opt4`} 
                    required 
                    style={{
                      padding: '0.6rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white'
                    }}
                  />
                </div>
              </div>

              {/* Correct Option Dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '250px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Correct Option</label>
                <select 
                  name={`q${num}_correct`} 
                  required
                  style={{
                    padding: '0.6rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white'
                  }}
                >
                  <option value="1" style={{ background: '#121212' }}>Option 1</option>
                  <option value="2" style={{ background: '#121212' }}>Option 2</option>
                  <option value="3" style={{ background: '#121212' }}>Option 3</option>
                  <option value="4" style={{ background: '#121212' }}>Option 4</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-4" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            Publish Quiz
          </button>
        </div>
      </form>
    </div>
  )
}
