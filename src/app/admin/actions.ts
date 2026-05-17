'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveDocument(formData: FormData) {
  const supabase = await createClient()

  // Verify authentication and Admin role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const userRole = profile?.role?.trim().toLowerCase() || 'user';
  console.log("Admin Action userRole:", userRole, "rawRole:", profile?.role)

  if (userRole !== 'admin') {
    console.error("Access Forbidden. Role is not admin.")
    return { error: 'Forbidden. Admin access required.' }
  }

  const documentId = formData.get('document_id') as string
  if (!documentId) return { error: 'Document ID is missing' }

  const { data: updateData, error } = await supabase
    .from('documents')
    .update({ status: 'approved' })
    .eq('id', documentId)
    .select()

  console.log("Update Result Data:", updateData, "Error:", error)

  if (error) {
    console.error('Approval Error:', error)
    return { error: 'Failed to approve document' }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function rejectDocument(formData: FormData) {
  const supabase = await createClient()

  // Verify authentication and Admin role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Forbidden. Admin access required.' }
  }

  const documentId = formData.get('document_id') as string
  if (!documentId) return { error: 'Document ID is missing' }

  // Note: For a real app, you might also want to delete the file from Supabase Storage
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)

  if (error) {
    console.error('Rejection Error:', error)
    return { error: 'Failed to reject document' }
  }

  revalidatePath('/admin')
  return { success: true }
}
