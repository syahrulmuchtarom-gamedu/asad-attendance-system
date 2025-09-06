import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function HomePage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('user_session')?.value
  
  if (sessionCookie) {
    redirect('/dashboard')
  }
  
  redirect('/login')
}
