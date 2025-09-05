import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Users, Target, TrendingUp, FileText } from 'lucide-react'
import { formatPercentage, getMonthName } from '@/lib/utils'

export default async function KoordinatorDaerahDashboard() {
  const supabase = createServerClient()

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

  if (!profile || profile.role !== 'koordinator_daerah') {
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
    currentAbsensi.forEach((item) => {
      totalHadir += item.hadir_putra + item.hadir_putri
      if (item.kelompok) {
        totalTarget += item.kelompok.target_putra + item.kelompok.target_putri
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
  const kelompokWithData = currentAbsensi?.length || 0
  const kelompokBelumInput = (totalKelompok || 0) - kelompokWithData

  // Get desa performance summary
  const { data: desaPerformance } = await supabase
    .from('desa')
    .select(`
      id,
      nama_desa,
      kelompok (
        id,
        target_putra,
        target_putri,
        absensi (
          hadir_putra,
          hadir_putri
        )
      )
    `)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Koordinator Daerah</h1>
          <p className="text-muted-foreground">
            Overview semua desa - {getMonthName(currentMonth)} {currentYear}
          </p>
        </div>
        <Button asChild>
          <Link href="/laporan">
            <FileText className="mr-2 h-4 w-4" />
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
              Desa aktif
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
            <CardTitle className="text-sm font-medium">Sudah Input</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kelompokWithData}</div>
            <p className="text-xs text-muted-foreground">
              Dari {totalKelompok || 0} kelompok
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kehadiran Daerah</CardTitle>
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

      {/* Progress per Desa */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Progress Input per Desa</CardTitle>
            <CardDescription>
              Status input absensi bulan {getMonthName(currentMonth)} {currentYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {desaPerformance && desaPerformance.length > 0 ? (
              <div className="space-y-3">
                {desaPerformance.map((desa) => {
                  const totalKelompokDesa = desa.kelompok?.length || 0
                  const kelompokInputDesa = desa.kelompok?.filter(k => 
                    k.absensi && k.absensi.length > 0
                  ).length || 0
                  const progressPercentage = totalKelompokDesa > 0 
                    ? (kelompokInputDesa / totalKelompokDesa) * 100 
                    : 0

                  return (
                    <div key={desa.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{desa.nama_desa}</span>
                        <span className="text-sm text-muted-foreground">
                          {kelompokInputDesa}/{totalKelompokDesa}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            progressPercentage === 100 ? 'bg-green-500' :
                            progressPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatPercentage(progressPercentage)} selesai
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Belum ada data
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Ringkasan Kehadiran</CardTitle>
            <CardDescription>
              Persentase kehadiran per desa bulan ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            {desaPerformance && desaPerformance.length > 0 ? (
              <div className="space-y-3">
                {desaPerformance.map((desa) => {
                  let totalTargetDesa = 0
                  let totalHadirDesa = 0

                  desa.kelompok?.forEach((kelompok) => {
                    totalTargetDesa += kelompok.target_putra + kelompok.target_putri
                    kelompok.absensi?.forEach((absensi) => {
                      totalHadirDesa += absensi.hadir_putra + absensi.hadir_putri
                    })
                  })

                  const persentaseDesa = totalTargetDesa > 0 
                    ? (totalHadirDesa / totalTargetDesa) * 100 
                    : 0

                  return (
                    <div key={desa.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">{desa.nama_desa}</span>
                      <div className="text-right">
                        <div className={`font-bold ${
                          persentaseDesa >= 80 ? 'text-green-600' :
                          persentaseDesa >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {formatPercentage(persentaseDesa)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {totalHadirDesa}/{totalTargetDesa}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Belum ada data kehadiran
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}