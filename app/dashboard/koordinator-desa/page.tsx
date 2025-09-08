import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Target, TrendingUp, Plus, FileText } from 'lucide-react'

export default async function KoordinatorDesaDashboard() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('user_session')?.value
  
  if (!sessionCookie) {
    redirect('/login')
  }

  const user = JSON.parse(sessionCookie)
  
  if (user.role !== 'koordinator_desa') {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Koordinator Desa</h1>
          <p className="text-muted-foreground">
            Selamat datang, {user.full_name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/absensi">
              <Plus className="mr-2 h-4 w-4" />
              Input Absensi
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/laporan">
              <FileText className="mr-2 h-4 w-4" />
              Lihat Laporan
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kelompok</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Kelompok di desa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sudah Input</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Dari 8 kelompok
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Input</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">
              Kelompok tersisa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kehadiran</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              156 dari 200 target
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}