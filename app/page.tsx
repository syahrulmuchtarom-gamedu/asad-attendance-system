import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function HomePage() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (sessionCookie) {
      redirect('/dashboard')
    } else {
      redirect('/login')
    }
  } catch (error) {
    console.error('Home page error:', error)
    redirect('/login')
  }
}
