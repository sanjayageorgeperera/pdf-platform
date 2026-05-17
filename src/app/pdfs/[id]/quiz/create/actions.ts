'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createQuiz(formData: FormData) {
  const supabase = await createClient()

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

  const documentId = formData.get('document_id') as string
  const quizTitle = formData.get('quiz_title') as string

  if (!documentId || !quizTitle) {
    redirect(`/pdfs/${documentId}?error=Quiz Title is required.`)
  }

  // 1. Insert Quiz
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .insert({
      document_id: documentId,
      title: quizTitle
    })
    .select()
    .single()

  if (quizError || !quiz) {
    console.error('Quiz Create Error:', quizError)
    redirect(`/pdfs/${documentId}?error=Failed to create quiz record.`)
  }

  // 2. Insert Questions (3 questions)
  const questionsToInsert = []

  for (let i = 1; i <= 3; i++) {
    const questionText = formData.get(`q${i}_text`) as string
    const opt1 = formData.get(`q${i}_opt1`) as string
    const opt2 = formData.get(`q${i}_opt2`) as string
    const opt3 = formData.get(`q${i}_opt3`) as string
    const opt4 = formData.get(`q${i}_opt4`) as string
    const correctOpt = formData.get(`q${i}_correct`) as string // Index 1-4

    if (!questionText || !opt1 || !opt2 || !opt3 || !opt4 || !correctOpt) {
      // Clean up quiz record if incomplete
      await supabase.from('quizzes').delete().eq('id', quiz.id)
      redirect(`/pdfs/${documentId}?error=All question fields are required.`)
    }

    const options = [opt1, opt2, opt3, opt4]
    const correctIndex = parseInt(correctOpt, 10) - 1
    const correctAnswer = options[correctIndex]

    questionsToInsert.push({
      quiz_id: quiz.id,
      question_text: questionText,
      options,
      correct_answer: correctAnswer
    })
  }

  const { error: questionsError } = await supabase
    .from('questions')
    .insert(questionsToInsert)

  if (questionsError) {
    console.error('Questions Insert Error:', questionsError)
    // Clean up quiz record if questions failed
    await supabase.from('quizzes').delete().eq('id', quiz.id)
    redirect(`/pdfs/${documentId}?error=Failed to insert questions.`)
  }

  revalidatePath(`/pdfs/${documentId}`)
  redirect(`/pdfs/${documentId}?message=Quiz created successfully!`)
}
