import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'

export default async function HomePage() {
  try {
    const user = getSession()
    
    if (user) {
      redirect('/dashboard')
    } else {
      redirect('/login')
    }
  } catch (error) {
    console.error('Home page error:', error)
    redirect('/login')
  }
}