import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

export default async function AbsensiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('user_session')?.value
    
    console.log('🍪 Absensi layout - Session cookie:', sessionCookie ? 'exists' : 'missing')
    
    if (!sessionCookie) {
      console.log('❌ No session cookie, redirecting to login')
      redirect('/login')
    }

    let user
    try {
      user = JSON.parse(sessionCookie)
      console.log('✅ User parsed successfully:', user.role)
    } catch (parseError) {
      console.error('❌ Failed to parse session cookie:', parseError)
      redirect('/login')
    }
    
    // Validate required user fields
    if (!user || !user.role || !user.id) {
      console.error('❌ Invalid user data:', user)
      redirect('/login')
    }
    
    // Convert user to profile format
    const profile = {
      id: user.id.toString(),
      email: user.username ? user.username + '@asad.com' : user.email || 'unknown@asad.com',
      full_name: user.full_name || user.username || 'Unknown User',
      role: user.role,
      desa_id: user.desa_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('✅ Profile created for role:', profile.role)

    return (
      <DashboardLayout profile={profile}>
        {children}
      </DashboardLayout>
    )
  } catch (error) {
    console.error('❌ Absensi layout error:', error)
    redirect('/login')
  }
}