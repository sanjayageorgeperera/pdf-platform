import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import QuizContainer from './QuizContainer'

export const dynamic = 'force-dynamic';

export default async function TakeQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  // Verify authentication (required to take quiz)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/login?error=You must be logged in to take the quiz.&redirect=/pdfs/${id}/quiz`)
  }

  // 1. Fetch Quiz Info
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('document_id', id)
    .maybeSingle()

  if (quizError || !quiz) {
    redirect(`/pdfs/${id}?error=No quiz exists for this document.`)
  }

  // 2. Fetch Questions
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('id, question_text, options')
    .eq('quiz_id', quiz.id)
    .order('created_at', { ascending: true })

  if (qError || !questions || questions.length === 0) {
    redirect(`/pdfs/${id}?error=Failed to load quiz questions.`)
  }

  return (
    <div className="container mt-8 animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <Link href={`/pdfs/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem', textDecoration: 'none', fontSize: '0.875rem', opacity: 0.6 }} className="hover:opacity-100 transition-opacity">
        ← Back to PDF
      </Link>
      <header className="text-center mb-8">
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Interactive Quiz</h1>
        <p style={{ opacity: 0.6 }}>Test your knowledge and earn points!</p>
      </header>

      <QuizContainer 
        documentId={id} 
        quiz={quiz} 
        questions={questions} 
      />
    </div>
  )
}
