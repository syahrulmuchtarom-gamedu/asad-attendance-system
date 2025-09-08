import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Target, TrendingUp, Plus, FileText } from 'lucide-react'
import { formatPercentage, getMonthName } from '@/lib/utils'

export default async function KoordinatorDesaDashboard() {
  const supabase = createClient()

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

  if (!profile || profile.role !== 'koordinator_desa' || !profile.desa_id) {
    redirect('/dashboard')
  }

  // Get current month/year
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  // Get desa info and kelompok
  const { data: desa } = await supabase
    .from('desa')
    .select('*')
    .eq('id', profile.desa_id)
    .single()

  const { data: kelompokList } = await supabase
    .from('kelompok')
    .select('*')
    .eq('desa_id', profile.desa_id)
    .order('nama_kelompok')

  // Get current month attendance for this desa
  const { data: currentAbsensi } = await supabase
    .from('absensi')
    .select(`
      *,
      kelompok:kelompok_id (
        nama_kelompok,
        target_putra,
        target_putri
      )
    `)
    .eq('bulan', currentMonth)
    .eq('tahun', currentYear)
    .in('kelompok_id', kelompokList?.map(k => k.id) || [])

  // Calculate stats
  const totalKelompok = kelompokList?.length || 0
  const kelompokWithData = currentAbsensi?.length || 0
  const kelompokBelumInput = totalKelompok - kelompokWithData

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
  if (kelompokList) {
    const inputtedKelompokIds = currentAbsensi?.map(a => a.kelompok_id) || []
    kelompokList.forEach((kelompok) => {
      if (!inputtedKelompokIds.includes(kelompok.id)) {
        totalTarget += kelompok.target_putra + kelompok.target_putri
      }
    })
  }

  const persentaseKehadiran = totalTarget > 0 ? (totalHadir / totalTarget) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Koordinator Desa</h1>
          <p className="text-muted-foreground">
            Desa {desa?.nama_desa} - {getMonthName(currentMonth)} {currentYear}
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
            <Link href="/laporan/desa">
              <FileText className="mr-2 h-4 w-4" />
              Lihat Laporan
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kelompok</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKelompok}</div>
            <p className="text-xs text-muted-foreground">
              Kelompok di desa ini
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
              Dari {totalKelompok} kelompok
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Input</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{kelompokBelumInput}</div>
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
            <div className="text-2xl font-bold">
              {formatPercentage(persentaseKehadiran)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalHadir} dari {totalTarget} target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Kelompok Status */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Kelompok Sudah Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Kelompok Sudah Input</CardTitle>
            <CardDescription>
              Data absensi bulan {getMonthName(currentMonth)} {currentYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentAbsensi && currentAbsensi.length > 0 ? (
              <div className="space-y-2">
                {currentAbsensi.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="font-medium">{item.kelompok?.nama_kelompok}</span>
                    <span className="text-sm text-muted-foreground">
                      P: {item.hadir_putra}, Pr: {item.hadir_putri}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Belum ada kelompok yang input data
              </p>
            )}
          </CardContent>
        </Card>

        {/* Kelompok Belum Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Kelompok Belum Input</CardTitle>
            <CardDescription>
              Perlu input data absensi bulan ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            {kelompokList && kelompokBelumInput > 0 ? (
              <div className="space-y-2">
                {kelompokList
                  .filter(k => !currentAbsensi?.some(a => a.kelompok_id === k.id))
                  .map((kelompok) => (
                    <div key={kelompok.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="font-medium">{kelompok.nama_kelompok}</span>
                      <span className="text-sm text-muted-foreground">
                        Target: {kelompok.target_putra + kelompok.target_putri}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Semua kelompok sudah input data
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}