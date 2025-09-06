import { cookies } from 'next/headers'

export interface User {
  id: number
  username: string
  full_name: string
  role: string
  desa_id?: number
}

export function getSession(): User | null {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('user_session')?.value
    
    if (!sessionCookie) return null
    
    return JSON.parse(sessionCookie)
  } catch (error) {
    return null
  }
}

export function requireAuth(): User {
  const user = getSession()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}