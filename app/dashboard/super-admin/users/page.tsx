'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Plus, Edit, Trash2 } from 'lucide-react'

const mockUsers = [
  { id: 1, username: 'admin', full_name: 'Super Admin', role: 'super_admin', desa_name: '-' },
  { id: 2, username: 'koordinator1', full_name: 'Koordinator Kapuk Melati', role: 'koordinator_desa', desa_name: 'Kapuk Melati' },
  { id: 3, username: 'koordinator2', full_name: 'Koordinator Jelambar', role: 'koordinator_desa', desa_name: 'Jelambar' },
]

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers)

  const handleAddUser = () => {
    alert('Fitur Tambah User akan segera tersedia')
  }

  const handleEditUser = (userId: number) => {
    alert(`Edit user dengan ID: ${userId}`)
  }

  const handleDeleteUser = (userId: number) => {
    if (userId === 1) {
      alert('Super Admin tidak dapat dihapus')
      return
    }
    const updatedUsers = users.filter(u => u.id !== userId)
    setUsers(updatedUsers)
    alert('User berhasil dihapus')
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
        <Button onClick={handleAddUser}>
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
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{user.username}</td>
                    <td className="p-3">{user.full_name}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">{user.desa_name}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                        >
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
    </div>
  )
}