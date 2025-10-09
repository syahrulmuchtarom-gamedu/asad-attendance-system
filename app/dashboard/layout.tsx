import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) {
      redirect('/login')
    }

    const user = JSON.parse(sessionCookie)
    
    // Convert user to profile format
    const profile = {
      id: user.id.toString(),
      email: user.username + '@asad.com',
      full_name: user.full_name,
      role: user.role,
      desa_id: user.desa_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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