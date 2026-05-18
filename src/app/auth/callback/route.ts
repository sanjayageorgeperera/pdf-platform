import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Ensure a profile exists in public.profiles (especially important for OAuth/Google logins)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()
          
        if (!profile) {
          const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
          const { error: profileError } = await supabase.from('profiles').insert([
            { 
              id: user.id, 
              full_name: fullName, 
              role: 'user' 
            }
          ])
          
          if (profileError) {
            console.error("Auto Profile Insertion Error:", profileError)
          }
        }
      }
      
      // Redirect to next page (dashboard)
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error("Exchange Code for Session Error:", error)
    }
  }

  // Return the user to the login page with a friendly error
  return NextResponse.redirect(`${origin}/login?error=Authentication failed during Google login`)
}
