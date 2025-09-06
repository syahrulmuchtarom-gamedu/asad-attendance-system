import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Plus, Edit, Trash2 } from 'lucide-react'

// Mock users data
const mockUsers = [
  { id: 1, username: 'admin', full_name: 'Super Admin', role: 'super_admin', desa_id: null, desa_name: '-' },
  { id: 2, username: 'koordinator1', full_name: 'Koordinator Kapuk Melati', role: 'koordinator_desa', desa_id: 1, desa_name: 'Kapuk Melati' },
  { id: 3, username: 'koordinator2', full_name: 'Koordinator Jelambar', role: 'koordinator_desa', desa_id: 2, desa_name: 'Jelambar' },
  { id: 4, username: 'koordinator3', full_name: 'Koordinator Cengkareng', role: 'koordinator_desa', desa_id: 3, desa_name: 'Cengkareng' },
  { id: 5, username: 'koordinator_daerah', full_name: 'Koordinator Daerah', role: 'koordinator_daerah', desa_id: null, desa_name: '-' },
  { id: 6, username: 'viewer', full_name: 'Viewer', role: 'viewer', desa_id: null, desa_name: '-' },
]

const roleLabels = {
  'super_admin': 'Super Admin',
  'koordinator_desa': 'Koordinator Desa',
  'koordinator_daerah': 'Koordinator Daerah',
  'viewer': 'Viewer'
}

export default async function UsersPage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('user_session')?.value
  
  if (!sessionCookie) {
    redirect('/login')
  }

  const user = JSON.parse(sessionCookie)

  if (user.role !== 'super_admin') {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola User</h1>
          <p className="text-muted-foreground">
            Manajemen user dan hak akses sistem
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Daftar User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Username</th>
                  <th className="text-left p-3 font-medium">Nama Lengkap</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium">Desa</th>
                  <th className="text-left p-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{user.username}</td>
                    <td className="p-3">{user.full_name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'koordinator_desa' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'koordinator_daerah' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {roleLabels[user.role as keyof typeof roleLabels]}
                      </span>
                    </td>
                    <td className="p-3">{user.desa_name}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
            <p className="text-xs text-muted-foreground">User terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Koordinator Desa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockUsers.filter(u => u.role === 'koordinator_desa').length}
            </div>
            <p className="text-xs text-muted-foreground">User koordinator desa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockUsers.filter(u => u.role === 'super_admin').length}
            </div>
            <p className="text-xs text-muted-foreground">User admin</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}