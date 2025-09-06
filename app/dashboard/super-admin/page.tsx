import { getSession } from '@/lib/auth/session'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, Target, TrendingUp } from 'lucide-react'
import { redirect } from 'next/navigation'

export default function SuperAdminDashboard() {
  const user = getSession()
  
  if (!user || user.role !== 'super_admin') {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Super Admin</h1>
        <p className="text-muted-foreground">
          Selamat datang, {user.full_name}!
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
            <div className="text-2xl font-bold">8</div>
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
            <div className="text-2xl font-bold">30</div>
            <p className="text-xs text-muted-foreground">
              Kelompok aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              User terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selamat Datang</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{user.full_name}</div>
            <p className="text-xs text-muted-foreground">
              Role: {user.role}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Super Admin</CardTitle>
          <CardDescription>
            Sistem login berhasil! Dashboard sedang dalam pengembangan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Login berhasil sebagai: <strong>{user.username}</strong></p>
          <p>Role: <strong>{user.role}</strong></p>
        </CardContent>
      </Card>
    </div>
  )
}
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
                      Oleh: {item.users?.full_name || item.users?.username}
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
