import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { deleteQuiz } from '@/app/pdfs/[id]/actions'
import AdBanner from '@/components/AdBanner'

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

      {/* Guest Invitation Banner */}
      {!user && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08))',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontSize: '1.6rem' }}>🔐</span>
            <div>
              <h4 style={{ fontWeight: 600, margin: 0, color: 'white', fontSize: '1rem' }}>Quiz karanna login karaganna</h4>
              <p style={{ fontSize: '0.825rem', opacity: 0.7, marginTop: '0.2rem' }}>
                Test your knowledge and earn points! Please log in or create an account to start.
              </p>
            </div>
          </div>
          <Link 
            href="/login?redirect=/quizzes" 
            className="btn btn-primary"
            style={{ textDecoration: 'none', padding: '0.55rem 1.25rem', whiteSpace: 'nowrap' }}
          >
            Log In / Sign Up
          </Link>
        </div>
      )}

      {/* Ad Space */}
      <AdBanner dataAdSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_QUIZZES || 'quizzes-banner'} />

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
                borderLeft: user ? '3px solid var(--accent)' : '3px solid rgba(255, 255, 255, 0.2)',
                opacity: user ? 1 : 0.85
              }}
            >
              <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{user ? '🏆' : '🔒'}</span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{quiz.title}</h3>
              <p style={{ opacity: 0.7, fontSize: '0.875rem', flex: 1, marginBottom: '1.5rem' }}>
                Based on document: <strong style={{ color: 'white' }}>{quiz.documents?.title}</strong>
              </p>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                {user ? (
                  <Link 
                    href={`/pdfs/${quiz.documents?.id}/quiz`} 
                    className="btn btn-primary text-center" 
                    style={{ textDecoration: 'none', flex: 1, padding: '0.6rem' }}
                  >
                    Start Quiz (+30 Points)
                  </Link>
                ) : (
                  <Link 
                    href={`/login?redirect=/pdfs/${quiz.documents?.id}/quiz`}
                    className="btn text-center"
                    style={{ 
                      textDecoration: 'none', 
                      flex: 1, 
                      padding: '0.6rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.6)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    🔒 Login to Take Quiz
                  </Link>
                )}
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
