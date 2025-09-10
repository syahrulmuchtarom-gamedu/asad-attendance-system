'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  UserCheck
} from 'lucide-react'
import { Profile } from '@/types'
import { ROLE_LABELS } from '@/lib/constants'

interface DashboardLayoutProps {
  children: React.ReactNode
  profile: Profile
}

export function DashboardLayout({ children, profile }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: "Logout Berhasil",
          description: "Anda telah keluar dari sistem",
        })
        router.push('/login')
        router.refresh()
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description: "Gagal logout, silakan coba lagi",
      })
    }
  }

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
    ]

    switch (profile.role) {
      case 'super_admin':
        return [
          ...baseItems,
          { name: 'Kelola User', href: '/dashboard/super-admin/users', icon: Users },
          { name: 'Master Data', href: '/dashboard/super-admin/master', icon: Settings },
          { name: 'Input Absensi', href: '/absensi', icon: UserCheck },
          { name: 'Laporan', href: '/laporan', icon: BarChart3 },
        ]
      case 'koordinator_desa':
        return [
          ...baseItems,
          { name: 'Input Absensi', href: '/absensi', icon: UserCheck },
          { name: 'Laporan Desa', href: '/laporan/desa', icon: FileText },
        ]
      case 'koordinator_daerah':
        return [
          ...baseItems,
          { name: 'Laporan Daerah', href: '/laporan', icon: BarChart3 },
        ]
      case 'viewer':
        return [
          ...baseItems,
          { name: 'Laporan', href: '/laporan', icon: FileText },
        ]
      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-base font-bold text-gray-900">Absensi ASAD</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-sm lg:text-base xl:text-lg font-bold text-gray-900">
              <span className="hidden lg:inline">Absensi Penderesan ASAD</span>
              <span className="lg:hidden">Absensi ASAD</span>
            </h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile.full_name || profile.email}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {ROLE_LABELS[profile.role]}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="ml-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
              <div className="flex items-center gap-x-2">
                <span className="text-sm text-gray-700">
                  {profile.full_name || profile.email}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="lg:hidden"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}