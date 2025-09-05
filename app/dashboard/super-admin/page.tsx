import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, Target, TrendingUp, Calendar, UserCheck } from 'lucide-react'
import { formatPercentage, getMonthName } from '@/lib/utils'

export default async function SuperAdminDashboard() {
  const supabase = createServerSupabaseClient()

  // Get current month/year stats
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  // Get total counts
  const [
    { count: totalDesa },
    { count: totalKelompok },
    { count: totalUsers },
  ] = await Promise.all([
    supabase.from('desa').select('*', { count: 'exact', head: true }),
    supabase.from('kelompok').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
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
    currentAbsensi.forEach((item: any) => {
      totalHadir += item.hadir_putra + item.hadir_putri
      if (item.kelompok && Array.isArray(item.kelompok) && item.kelompok[0]) {
        totalTarget += item.kelompok[0].target_putra + item.kelompok[0].target_putri
      }
    })
  }

  const persentaseKehadiran = totalTarget > 0 ? (totalHadir / totalTarget) * 100 : 0

  // Get recent activity (last 5 entries)
  const { data: recentActivity } = await supabase
    .from('absensi')
    .select(`
      *,
      kelompok:kelompok_id (
        nama_kelompok,
        desa:desa_id (
          nama_desa
        )
      ),
      profiles:input_by (
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Super Admin</h1>
        <p className="text-muted-foreground">
          Overview sistem absensi ASAD - {getMonthName(currentMonth)} {currentYear}
        </p>
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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              User terdaftar
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
              {totalTarget > 0 ? formatPercentage(persentaseKehadiran) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalHadir} dari {totalTarget} target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>
            Input absensi terbaru dari koordinator desa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">
                      {item.kelompok?.nama_kelompok} - {item.kelompok?.desa?.nama_desa}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getMonthName(item.bulan)} {item.tahun} • 
                      Putra: {item.hadir_putra}, Putri: {item.hadir_putri}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Oleh: {item.profiles?.full_name || item.profiles?.email}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Belum ada aktivitas
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}