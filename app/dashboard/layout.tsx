import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const supabase = createServerClient()

    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      redirect('/login')
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile) {
      redirect('/login')
    }

    return (
      <DashboardLayout profile={profile}>
        {children}
      </DashboardLayout>
    )
  } catch (error) {
    console.error('Dashboard layout error:', error)
    redirect('/login')
  }
}