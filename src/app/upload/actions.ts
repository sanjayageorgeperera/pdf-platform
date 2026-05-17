'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function uploadPdf(formData: FormData) {
  const supabase = await createClient()

  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  const file = formData.get('pdf_file') as File
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string || 'General'
  const language = formData.get('language') as string || 'English'

  if (!file || !title) {
    redirect('/upload?error=File and Title are required')
  }

  // Generate a unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`
  const filePath = `public/${fileName}`

  // Upload to Supabase Storage bucket named 'pdfs'
  const { error: uploadError } = await supabase.storage
    .from('pdfs')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Upload Error:', uploadError)
    redirect('/upload?error=Failed to upload file to storage. Check bucket permissions.')
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('pdfs')
    .getPublicUrl(filePath)

  // Ensure profile exists (fallback if signup insert failed)
  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()
  if (!profile) {
    await supabase.from('profiles').insert([
      { id: user.id, full_name: user.email?.split('@')[0] || 'User', role: 'user' }
    ])
  }

  // Insert record into 'documents' table
  const { error: dbError } = await supabase
    .from('documents')
    .insert({
      title,
      description,
      category,
      language,
      file_url: publicUrlData.publicUrl,
      uploader_id: user.id,
      status: 'pending' // Default status requires admin approval
    })

  if (dbError) {
    console.error('DB Error:', dbError)
    redirect('/upload?error=Failed to save document details to database.')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?message=File uploaded successfully. Waiting for Admin approval.')
}
