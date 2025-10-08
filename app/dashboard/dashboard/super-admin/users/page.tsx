'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Users, Plus, Edit, Trash2, RotateCcw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: number
  username: string
  full_name: string
  role: string
  desa_id?: number
  is_active: boolean
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'viewer',
    is_active: true
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const result = await response.json()
      if (response.ok) {
        setUsers(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingUser ? '/api/users' : '/api/users'
      const method = editingUser ? 'PUT' : 'POST'
      const body = editingUser 
        ? { ...formData, id: editingUser.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: editingUser ? 'User berhasil diupdate' : 'User berhasil ditambahkan',
        })
        resetForm()
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Terjadi Kesalahan",
          description: error.error || "Gagal menyimpan user",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description: "Gagal menyimpan user",
      })
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      password: '',
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active
    })
    setShowEditModal(true)
  }

  const handleResetPassword = async (user: User) => {
    if (!confirm(`Reset password untuk ${user.username}?\nPassword akan direset ke: ${user.username}123`)) return

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          role: user.role,
          is_active: user.is_active,
          resetPassword: true
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: result.message,
        })
        fetchUsers()
      } else {
        toast({
          variant: "destructive",
          title: "Terjadi Kesalahan",
          description: result.error || "Gagal reset password",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description: "Gagal reset password",
      })
    }
  }

  const handleDelete = async (userId: number) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return

    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "User berhasil dihapus",
        })
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Terjadi Kesalahan",
          description: error.error || "Gagal menghapus user",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description: "Gagal menghapus user",
      })
    }
  }

  const resetForm = () => {
    setShowAddForm(false)
    setShowEditModal(false)
    setEditingUser(null)
    setFormData({ username: '', password: '', full_name: '', role: 'viewer', is_active: true })
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola User</h1>
          <p className="text-muted-foreground">
            Manajemen user dan hak akses sistem
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah User
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Tambah User Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="full_name">Nama Lengkap</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="koordinator_desa">Koordinator Desa</option>
                  <option value="koordinator_daerah">Koordinator Daerah</option>
                  <option value="viewer">Viewer</option>
                  <option value="astrida">Astrida</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Simpan</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit_username">Username</Label>
              <Input
                id="edit_username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_password">
                Password (kosongkan jika tidak ingin mengubah)
              </Label>
              <Input
                id="edit_password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit_full_name">Nama Lengkap</Label>
              <Input
                id="edit_full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_role">Role</Label>
              <select
                id="edit_role"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="super_admin">Super Admin</option>
                <option value="koordinator_desa">Koordinator Desa</option>
                <option value="koordinator_daerah">Koordinator Daerah</option>
                <option value="viewer">Viewer</option>
                <option value="astrida">Astrida</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit_is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              />
              <Label htmlFor="edit_is_active">User Aktif</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Batal
              </Button>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Daftar User ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile Card Layout */}
          <div className="block md:hidden space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg">{user.username}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{user.full_name}</p>
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(user)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleResetPassword(user)}
                    className="flex-1 text-orange-600"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-600"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Username</th>
                  <th className="text-left p-3 font-medium">Nama Lengkap</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium">Status</th>
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
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(user)}
                          title="Edit User"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleResetPassword(user)}
                          title="Reset Password"
                          className="text-orange-600"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDelete(user.id)}
                          title="Hapus User"
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