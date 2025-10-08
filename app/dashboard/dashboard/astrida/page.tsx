import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Card } from '@/components/ui/card'
import { BarChart3, UserCheck, FileText } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AstridaDashboard() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('user_session')?.value
  
  if (!sessionCookie) {
    redirect('/login')
  }

  const user = JSON.parse(sessionCookie)
  
  if (user.role !== 'astrida') {
    redirect('/dashboard')
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Astrida</h1>
          <p className="text-gray-600">Selamat datang di sistem absensi ASAD</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/absensi">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Input Absensi</h3>
                  <p className="text-sm text-gray-600">Kelola data kehadiran</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/laporan">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Laporan</h3>
                  <p className="text-sm text-gray-600">Lihat laporan kehadiran</p>
                </div>
              </div>
            </Card>
          </Link>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Akses Penuh</h3>
                <p className="text-sm text-gray-600">Input & laporan semua desa</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
  )
}