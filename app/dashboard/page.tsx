'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const sessionCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_session='))
      ?.split('=')[1]

    if (!sessionCookie) {
      router.push('/login')
      return
    }

    try {
      const user = JSON.parse(decodeURIComponent(sessionCookie))
      
      switch (user.role) {
        case 'super_admin':
          router.replace('/dashboard/super-admin')
          break
        case 'koordinator_desa':
          router.replace('/dashboard/koordinator-desa')
          break
        case 'koordinator_daerah':
          router.replace('/dashboard/koordinator-daerah')
          break
        case 'viewer':
          router.replace('/dashboard/viewer')
          break
        case 'astrida':
          router.replace('/dashboard/astrida')
          break
        default:
          router.push('/login')
      }
    } catch (error) {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}