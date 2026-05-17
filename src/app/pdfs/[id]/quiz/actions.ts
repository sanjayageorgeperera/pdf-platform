'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitQuizScore(
  documentId: string,
  quizId: string,
  answers: string[]
) {
  const supabase = await createClient()

  // Verify authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 1. Fetch questions to grade them on the server for security (prevent cheating!)
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('id, correct_answer')
    .eq('quiz_id', quizId)
    .order('created_at', { ascending: true })

  if (qError || !questions || questions.length === 0) {
    console.error('Quiz Grading Error:', qError)
    redirect(`/pdfs/${documentId}?error=${encodeURIComponent('Failed to grade quiz.')}`)
  }

  // Grade the quiz
  let score = 0
  questions.forEach((q, idx) => {
    const userAnswer = answers[idx]
    if (userAnswer === q.correct_answer) {
      score += 10 // 10 points per correct answer (30 points total)
    }
  })

  // 2. Save Score to user_scores (upsert)
  const { data: existingScore } = await supabase
    .from('user_scores')
    .select('id, score')
    .eq('user_id', user.id)
    .eq('quiz_id', quizId)
    .maybeSingle()

  let scoreDifference = score

  if (existingScore) {
    // Only update if the new score is higher
    if (score > existingScore.score) {
      scoreDifference = score - existingScore.score
      await supabase
        .from('user_scores')
        .update({ score })
        .eq('id', existingScore.id)
    } else {
      scoreDifference = 0 // No new score points
    }
  } else {
    // Insert new score
    const { error: insertScoreError } = await supabase
      .from('user_scores')
      .insert({
        user_id: user.id,
        quiz_id: quizId,
        score
      })

    if (insertScoreError) {
      console.error('Score Insert Error:', insertScoreError)
      redirect(`/pdfs/${documentId}?error=${encodeURIComponent('Failed to save quiz score.')}`)
    }
  }

  // 3. Update total_score in profiles
  if (scoreDifference > 0) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_score')
      .eq('id', user.id)
      .single()

    const currentTotal = profile?.total_score || 0
    await supabase
      .from('profiles')
      .update({ total_score: currentTotal + scoreDifference })
      .eq('id', user.id)
  }

  revalidatePath(`/pdfs/${documentId}`)
  revalidatePath('/dashboard')
  redirect(`/pdfs/${documentId}?message=${encodeURIComponent(`Quiz completed! You scored ${score}/30 points! 🎉`)}`)
}
