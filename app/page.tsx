import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function HomePage() {
  try {
    const supabase = createServerSupabaseClient()
    
    const {
      data: { session },
      error
    } = await supabase.auth.getSession()

    if (error) {
      redirect('/login')
    }

    if (session) {
      redirect('/dashboard')
    } else {
      redirect('/login')
    }
  } catch (error) {
    console.error('Home page error:', error)
    redirect('/login')
  }
}