'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addReview(formData: FormData) {
  const supabase = await createClient()

  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  const documentId = formData.get('document_id') as string

  if (authError || !user) {
    redirect(`/pdfs/${documentId}?error=You must be logged in to write a review.`)
  }

  const ratingStr = formData.get('rating') as string
  const commentText = formData.get('comment_text') as string

  if (!documentId || !ratingStr || !commentText) {
    redirect(`/pdfs/${documentId}?error=All fields are required.`)
  }

  const rating = parseInt(ratingStr, 10)
  if (isNaN(rating) || rating < 1 || rating > 5) {
    redirect(`/pdfs/${documentId}?error=Rating must be between 1 and 5.`)
  }

  // Insert review
  const { error: dbError } = await supabase
    .from('reviews')
    .insert({
      document_id: documentId,
      user_id: user.id,
      rating,
      comment_text: commentText
    })

  if (dbError) {
    console.error('Review DB Error:', dbError)
    redirect(`/pdfs/${documentId}?error=Failed to save your review.`)
  }

  revalidatePath(`/pdfs/${documentId}`)
  redirect(`/pdfs/${documentId}?message=Review added successfully!`)
}

export async function deleteDocument(documentId: string) {
  const supabase = await createClient()

  // 1. Verify Authentication & Role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/pdfs/${documentId}?error=${encodeURIComponent('You must be logged in.')}`)
  }

  const { data: document } = await supabase
    .from('documents')
    .select('uploader_id')
    .eq('id', documentId)
    .single()

  if (!document) {
    redirect('/dashboard?error=Document not found')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const userRole = profile?.role?.trim().toLowerCase()
  const isOwner = document.uploader_id === user.id

  if (userRole !== 'admin' && !isOwner) {
    redirect(`/pdfs/${documentId}?error=${encodeURIComponent('You are not authorized to delete this document.')}`)
  }

  // 2. Delete document
  const { error: deleteError } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)

  if (deleteError) {
    console.error('Delete Document Error:', deleteError)
    redirect(`/pdfs/${documentId}?error=${encodeURIComponent('Failed to delete document.')}`)
  }

  revalidatePath('/pdfs')
  revalidatePath('/dashboard')
  redirect(`/dashboard?message=${encodeURIComponent('Document deleted successfully! 🗑️')}`)
}

export async function deleteReview(documentId: string, reviewId: string) {
  const supabase = await createClient()

  // 1. Verify Authentication & Role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/pdfs/${documentId}?error=${encodeURIComponent('You must be logged in.')}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const userRole = profile?.role?.trim().toLowerCase()
  if (userRole !== 'admin') {
    redirect(`/pdfs/${documentId}?error=${encodeURIComponent('You must be an administrator to delete reviews.')}`)
  }

  // 2. Delete review
  const { error: deleteError } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)

  if (deleteError) {
    console.error('Delete Review Error:', deleteError)
    redirect(`/pdfs/${documentId}?error=${encodeURIComponent('Failed to delete comment.')}`)
  }

  revalidatePath(`/pdfs/${documentId}`)
  redirect(`/pdfs/${documentId}?message=${encodeURIComponent('Comment deleted successfully! 🗑️')}`)
}

export async function deleteQuiz(documentId: string, quizId: string) {
  const supabase = await createClient()

  // 1. Verify Authentication & Role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/pdfs/${documentId}?error=${encodeURIComponent('You must be logged in.')}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const userRole = profile?.role?.trim().toLowerCase()
  if (userRole !== 'admin') {
    redirect(`/pdfs/${documentId}?error=${encodeURIComponent('You must be an administrator to delete quizzes.')}`)
  }

  // 2. Delete quiz related records manually to prevent foreign key violation
  await supabase
    .from('user_scores')
    .delete()
    .eq('quiz_id', quizId)

  await supabase
    .from('questions')
    .delete()
    .eq('quiz_id', quizId)

  const { error: deleteError } = await supabase
    .from('quizzes')
    .delete()
    .eq('id', quizId)

  if (deleteError) {
    console.error('Delete Quiz Error:', deleteError)
    redirect(`/pdfs/${documentId}?error=${encodeURIComponent('Failed to delete quiz.')}`)
  }

  revalidatePath(`/pdfs/${documentId}`)
  revalidatePath('/quizzes')
  redirect(`/pdfs/${documentId}?message=${encodeURIComponent('Quiz deleted successfully! 🗑️')}`)
}
