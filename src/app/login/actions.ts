'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error("Login Error:", error)
    redirect('/login?error=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signUp(data)

  if (error) {
    console.error("Signup Error:", error)
    redirect('/login?error=Could not create user')
  }

  // Insert basic profile info
  if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
          { id: authData.user.id, full_name: data.email.split('@')[0], role: 'user' }
      ])
      if (profileError) {
          console.error("Profile Insert Error:", profileError)
      }
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Check email to continue sign in process')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  
  const { headers } = await import('next/headers')
  const reqHeaders = await headers()
  const origin = reqHeaders.get('origin') || reqHeaders.get('referer') || 'http://localhost:3000'
  const cleanOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${cleanOrigin}/auth/callback`,
    },
  })
  
  if (error) {
    console.error("Google Auth Error:", error)
    redirect('/login?error=Could not initiate Google authentication')
  }
  
  if (data?.url) {
    redirect(data.url)
  }
}

export async function makeMeAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id)
  }
  revalidatePath('/', 'layout')
  redirect('/admin')
}
