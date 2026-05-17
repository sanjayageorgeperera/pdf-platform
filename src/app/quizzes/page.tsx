import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { deleteQuiz } from '@/app/pdfs/[id]/actions'

export const dynamic = 'force-dynamic';

export default async function QuizzesPage() {
  const supabase = await createClient()

  // Fetch logged-in user role
  const { data: { user } } = await supabase.auth.getUser()
  let userRole = 'user'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    userRole = profile?.role?.trim().toLowerCase() || 'user'
  }

  // Fetch quizzes with their parent documents
  const { data: quizzes, error } = await supabase
    .from('quizzes')
    .select('*, documents(id, title, description)')
    .order('created_at', { ascending: false })

  return (
    <div className="container mt-8 animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <header className="mb-8">
        <h1 className="mb-2">Active Quizzes</h1>
        <p style={{ opacity: 0.7 }}>Select a quiz, test your knowledge, and earn scores to climb the leaderboard!</p>
      </header>

      {/* Ad Space */}
      <div className="card mb-8 text-center" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderStyle: 'dashed' }}>
        <p style={{ opacity: 0.5, fontSize: '0.875rem' }}>Top Quiz Banner Advertisement Space</p>
      </div>

      {error && <p style={{ color: 'var(--danger)' }}>Failed to load quizzes.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes && quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div 
              key={quiz.id} 
              className="card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                borderLeft: '3px solid var(--accent)'
              }}
            >
              <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏆</span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{quiz.title}</h3>
              <p style={{ opacity: 0.7, fontSize: '0.875rem', flex: 1, marginBottom: '1.5rem' }}>
                Based on document: <strong style={{ color: 'white' }}>{quiz.documents?.title}</strong>
              </p>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <Link 
                  href={`/pdfs/${quiz.documents?.id}/quiz`} 
                  className="btn btn-primary text-center" 
                  style={{ textDecoration: 'none', flex: 1, padding: '0.6rem' }}
                >
                  Start Quiz (+30 Points)
                </Link>
                {userRole === 'admin' && (
                  <form action={deleteQuiz.bind(null, quiz.documents?.id, quiz.id)} style={{ display: 'inline' }}>
                    <button 
                      type="submit" 
                      className="btn" 
                      style={{ 
                        padding: '0.6rem 0.8rem', 
                        background: 'var(--danger)', 
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer'
                      }}
                      title="Delete Quiz"
                    >
                      🗑️
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full card text-center py-8">
            <p style={{ opacity: 0.5 }}>No quizzes have been created yet. Admins can create quizzes inside PDF detail pages.</p>
          </div>
        )}
      </div>
    </div>
  )
}
