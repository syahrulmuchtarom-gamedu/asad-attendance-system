'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Building2, Users, Plus, Edit } from 'lucide-react'

// Mock data
const mockDesa = [
  { id: 1, nama_desa: 'Kapuk Melati', kelompok_count: 3 },
  { id: 2, nama_desa: 'Jelambar', kelompok_count: 4 },
  { id: 3, nama_desa: 'Cengkareng', kelompok_count: 3 },
  { id: 4, nama_desa: 'Kebon Jahe', kelompok_count: 4 },
  { id: 5, nama_desa: 'Bandara', kelompok_count: 3 },
  { id: 6, nama_desa: 'Taman Kota', kelompok_count: 4 },
  { id: 7, nama_desa: 'Kalideres', kelompok_count: 5 },
  { id: 8, nama_desa: 'Cipondoh', kelompok_count: 4 },
]

const mockKelompok = [
  { id: 1, nama_kelompok: 'Melati A', desa_name: 'Kapuk Melati', target_putra: 25 },
  { id: 2, nama_kelompok: 'Melati B', desa_name: 'Kapuk Melati', target_putra: 25 },
  { id: 3, nama_kelompok: 'BGN', desa_name: 'Kapuk Melati', target_putra: 25 },
  { id: 4, nama_kelompok: 'Indah', desa_name: 'Jelambar', target_putra: 25 },
  { id: 5, nama_kelompok: 'Damar', desa_name: 'Jelambar', target_putra: 25 },
]

export default function MasterDataPage() {
  const [desa, setDesa] = useState(mockDesa)
  const [kelompok, setKelompok] = useState(mockKelompok)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const cookies = document.cookie.split(';')
        const sessionCookie = cookies.find(c => c.trim().startsWith('user_session='))
        
        if (!sessionCookie) {
          router.push('/login')
          return
        }

        const cookieValue = sessionCookie.split('=')[1]
        const user = JSON.parse(decodeURIComponent(cookieValue))
        
        if (user.role !== 'super_admin') {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  const handleAddDesa = () => {
    toast({
      title: "Tambah Desa",
      description: "Fitur tambah desa akan segera tersedia",
    })
  }

  const handleEditDesa = (desaId: number) => {
    toast({
      title: "Edit Desa",
      description: `Edit desa dengan ID: ${desaId}`,
    })
  }

  const handleAddKelompok = () => {
    toast({
      title: "Tambah Kelompok",
      description: "Fitur tambah kelompok akan segera tersedia",
    })
  }

  const handleEditKelompok = (kelompokId: number) => {
    toast({
      title: "Edit Kelompok",
      description: `Edit kelompok dengan ID: ${kelompokId}`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Master Data</h1>
        <p className="text-muted-foreground">
          Kelola data desa dan kelompok
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Desa */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Data Desa
            </CardTitle>
            <Button size="sm" onClick={handleAddDesa}>
              <Plus className="mr-2 h-3 w-3" />
              Tambah
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {desa.map((desaItem) => (
                <div key={desaItem.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{desaItem.nama_desa}</p>
                    <p className="text-sm text-muted-foreground">
                      {desaItem.kelompok_count} kelompok
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEditDesa(desaItem.id)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Kelompok */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Data Kelompok
            </CardTitle>
            <Button size="sm" onClick={handleAddKelompok}>
              <Plus className="mr-2 h-3 w-3" />
              Tambah
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {kelompok.map((kelompokItem) => (
                <div key={kelompokItem.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{kelompokItem.nama_kelompok}</p>
                    <p className="text-sm text-muted-foreground">
                      {kelompokItem.desa_name} • Target: {kelompokItem.target_putra}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEditKelompok(kelompokItem.id)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Desa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{desa.length}</div>
            <p className="text-xs text-muted-foreground">Desa terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Kelompok</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30</div>
            <p className="text-xs text-muted-foreground">Kelompok aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Target Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">750</div>
            <p className="text-xs text-muted-foreground">Orang per bulan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata per Kelompok</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">Target putra</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}