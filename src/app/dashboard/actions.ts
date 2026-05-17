'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function editDocument(formData: FormData) {
  const supabase = await createClient()

  // 1. Verify Authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const documentId = formData.get('document_id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string || 'General'
  const language = formData.get('language') as string || 'English'

  if (!documentId || !title) {
    redirect(`/dashboard/edit/${documentId}?error=Title is required`)
  }

  // 2. Fetch document to ensure owner or admin
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
    redirect('/dashboard?error=You are not authorized to edit this document.')
  }

  // 3. Update document details
  const { error: updateError } = await supabase
    .from('documents')
    .update({
      title,
      description,
      category,
      language
    })
    .eq('id', documentId)

  if (updateError) {
    console.error('Update Document Error:', updateError)
    redirect(`/dashboard/edit/${documentId}?error=Failed to update document details.`)
  }

  revalidatePath('/pdfs')
  revalidatePath('/dashboard')
  revalidatePath(`/pdfs/${documentId}`)
  
  redirect('/dashboard?message=Document details updated successfully!')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  // Verify authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const fullName = formData.get('full_name') as string

  if (!fullName || !fullName.trim()) {
    redirect('/dashboard?error=Full name cannot be empty')
  }

  // Update profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ full_name: fullName.trim() })
    .eq('id', user.id)

  if (updateError) {
    console.error('Update Profile Error:', updateError)
    redirect('/dashboard?error=Failed to update profile details.')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?message=Profile details updated successfully!')
}
