import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('user_session')?.value
  
  if (!sessionCookie) {
    redirect('/login')
  }

  const user = JSON.parse(sessionCookie)

  // Redirect to role-specific dashboard
  switch (user.role) {
    case 'super_admin':
      redirect('/dashboard/super-admin')
    case 'koordinator_desa':
      redirect('/dashboard/koordinator-desa')
    case 'koordinator_daerah':
      redirect('/dashboard/koordinator-daerah')
    case 'viewer':
      redirect('/dashboard/viewer')
    default:
      redirect('/login')
  }
}