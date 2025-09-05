import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Users, Target, TrendingUp, FileText, Eye } from 'lucide-react'
import { formatPercentage, getMonthName } from '@/lib/utils'

export default async function ViewerDashboard() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile || profile.role !== 'viewer') {
    redirect('/dashboard')
  }

  // Get current month/year
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  // Get total counts
  const [
    { count: totalDesa },
    { count: totalKelompok },
  ] = await Promise.all([
    supabase.from('desa').select('*', { count: 'exact', head: true }),
    supabase.from('kelompok').select('*', { count: 'exact', head: true }),
  ])

  // Get current month attendance data
  const { data: currentAbsensi } = await supabase
    .from('absensi')
    .select(`
      kelompok_id,
      hadir_putra,
      hadir_putri,
      kelompok:kelompok_id (
        target_putra,
        target_putri
      )
    `)
    .eq('bulan', currentMonth)
    .eq('tahun', currentYear)

  // Calculate current month stats
  let totalHadir = 0
  let totalTarget = 0

  if (currentAbsensi) {
    currentAbsensi.forEach((item: any) => {
      totalHadir += item.hadir_putra + item.hadir_putri
      if (item.kelompok && Array.isArray(item.kelompok) && item.kelompok[0]) {
        totalTarget += item.kelompok[0].target_putra + item.kelompok[0].target_putri
      }
    })
  }

  // Add target for kelompok that haven't input data yet
  const { data: allKelompok } = await supabase
    .from('kelompok')
    .select('id, target_putra, target_putri')

  if (allKelompok) {
    const inputtedKelompokIds = currentAbsensi?.map(a => a.kelompok_id) || []
    allKelompok.forEach((kelompok) => {
      if (!inputtedKelompokIds.includes(kelompok.id)) {
        totalTarget += kelompok.target_putra + kelompok.target_putri
      }
    })
  }

  const persentaseKehadiran = totalTarget > 0 ? (totalHadir / totalTarget) * 100 : 0

  // Get recent months data for trend
  const recentMonths = []
  for (let i = 2; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    recentMonths.push({
      bulan: date.getMonth() + 1,
      tahun: date.getFullYear(),
      label: getMonthName(date.getMonth() + 1)
    })
  }

  const monthlyStats = await Promise.all(
    recentMonths.map(async (month) => {
      const { data: monthAbsensi } = await supabase
        .from('absensi')
        .select(`
          kelompok_id,
          hadir_putra,
          hadir_putri,
          kelompok:kelompok_id (
            target_putra,
            target_putri
          )
        `)
        .eq('bulan', month.bulan)
        .eq('tahun', month.tahun)

      let monthHadir = 0
      let monthTarget = 0

      if (monthAbsensi) {
        monthAbsensi.forEach((item: any) => {
          monthHadir += item.hadir_putra + item.hadir_putri
          if (item.kelompok && Array.isArray(item.kelompok) && item.kelompok[0]) {
            monthTarget += item.kelompok[0].target_putra + item.kelompok[0].target_putri
          }
        })
      }

      // Add target for kelompok that haven't input data
      if (allKelompok) {
        const inputtedIds = monthAbsensi?.map(a => a.kelompok_id) || []
        allKelompok.forEach((kelompok) => {
          if (!inputtedIds.includes(kelompok.id)) {
            monthTarget += kelompok.target_putra + kelompok.target_putri
          }
        })
      }

      return {
        ...month,
        hadir: monthHadir,
        target: monthTarget,
        persentase: monthTarget > 0 ? (monthHadir / monthTarget) * 100 : 0
      }
    })
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Viewer</h1>
          <p className="text-muted-foreground">
            Laporan kehadiran ASAD - {getMonthName(currentMonth)} {currentYear}
          </p>
        </div>
        <Button asChild>
          <Link href="/laporan">
            <Eye className="mr-2 h-4 w-4" />
            Lihat Laporan Lengkap
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Desa</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDesa || 0}</div>
            <p className="text-xs text-muted-foreground">
              Desa terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kelompok</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKelompok || 0}</div>
            <p className="text-xs text-muted-foreground">
              Kelompok aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Bulanan</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTarget}</div>
            <p className="text-xs text-muted-foreground">
              Orang per bulan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kehadiran Bulan Ini</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(persentaseKehadiran)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalHadir} dari {totalTarget} target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Kehadiran 3 Bulan Terakhir</CardTitle>
          <CardDescription>
            Persentase kehadiran bulanan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyStats.map((stat, index) => (
              <div key={`${stat.bulan}-${stat.tahun}`} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{stat.label} {stat.tahun}</p>
                  <p className="text-sm text-muted-foreground">
                    {stat.hadir} dari {stat.target} target
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        stat.persentase >= 80 ? 'bg-green-500' :
                        stat.persentase >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(stat.persentase, 100)}%` }}
                    />
                  </div>
                  <span className={`font-bold text-lg ${
                    stat.persentase >= 80 ? 'text-green-600' :
                    stat.persentase >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(stat.persentase)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Laporan Tersedia</CardTitle>
            <CardDescription>
              Akses laporan dan data kehadiran
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/laporan">
                <FileText className="mr-2 h-4 w-4" />
                Laporan Bulanan
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/laporan?view=yearly">
                <FileText className="mr-2 h-4 w-4" />
                Laporan Tahunan
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Sistem</CardTitle>
            <CardDescription>
              Status dan informasi umum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Desa:</span>
                <span className="font-medium">{totalDesa || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Kelompok:</span>
                <span className="font-medium">{totalKelompok || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Daerah:</span>
                <span className="font-medium">750 orang</span>
              </div>
              <div className="flex justify-between">
                <span>Periode Aktif:</span>
                <span className="font-medium">{getMonthName(currentMonth)} {currentYear}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}