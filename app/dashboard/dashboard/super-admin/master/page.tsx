'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Users, Plus, Edit, Trash2, Phone } from 'lucide-react'
import { DesaForm } from '@/components/forms/desa-form'
import { KelompokForm } from '@/components/forms/kelompok-form'
import { ContactSettingsForm } from '@/components/forms/contact-settings-form'
import { useToast } from '@/hooks/use-toast'

interface Desa {
  id: number
  nama_desa: string
  kelompok_count: number
}

interface Kelompok {
  id: number
  nama_kelompok: string
  desa_name: string
  desa_id: number
  target_putra: number
  target_putri: number
}

export default function MasterDataPage() {
  const [desa, setDesa] = useState<Desa[]>([])
  const [kelompok, setKelompok] = useState<Kelompok[]>([])
  const [isDesaFormOpen, setIsDesaFormOpen] = useState(false)
  const [isKelompokFormOpen, setIsKelompokFormOpen] = useState(false)
  const [editingDesa, setEditingDesa] = useState<Desa | null>(null)
  const [editingKelompok, setEditingKelompok] = useState<Kelompok | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchDesa()
    fetchKelompok()
  }, [])

  const fetchDesa = async () => {
    try {
      const response = await fetch('/api/desa')
      if (response.ok) {
        const data = await response.json()
        setDesa(data)
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memuat data desa', variant: 'destructive' })
    }
  }

  const fetchKelompok = async () => {
    try {
      const response = await fetch('/api/kelompok')
      if (response.ok) {
        const data = await response.json()
        setKelompok(data)
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memuat data kelompok', variant: 'destructive' })
    }
  }

  const handleDesaSubmit = async (data: { nama_desa: string }) => {
    setIsLoading(true)
    try {
      const url = editingDesa ? '/api/desa' : '/api/desa'
      const method = editingDesa ? 'PUT' : 'POST'
      const body = editingDesa ? { ...data, id: editingDesa.id } : data

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast({ title: 'Berhasil', description: `Desa berhasil ${editingDesa ? 'diupdate' : 'ditambahkan'}` })
        fetchDesa()
        fetchKelompok()
        setIsDesaFormOpen(false)
        setEditingDesa(null)
      } else {
        throw new Error('Failed to save desa')
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal menyimpan desa', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKelompokSubmit = async (data: { nama_kelompok: string; desa_id: number; target_putra: number; target_putri: number }) => {
    setIsLoading(true)
    try {
      const url = '/api/kelompok'
      const method = editingKelompok ? 'PUT' : 'POST'
      const body = editingKelompok ? { ...data, id: editingKelompok.id } : data

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast({ title: 'Berhasil', description: `Kelompok berhasil ${editingKelompok ? 'diupdate' : 'ditambahkan'}` })
        fetchKelompok()
        fetchDesa()
        setIsKelompokFormOpen(false)
        setEditingKelompok(null)
      } else {
        throw new Error('Failed to save kelompok')
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal menyimpan kelompok', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDesa = async (id: number) => {
    if (!confirm('Yakin ingin menghapus desa ini?')) return
    
    try {
      const response = await fetch(`/api/desa?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast({ title: 'Berhasil', description: 'Desa berhasil dihapus' })
        fetchDesa()
        fetchKelompok()
      } else {
        throw new Error('Failed to delete desa')
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal menghapus desa', variant: 'destructive' })
    }
  }

  const handleDeleteKelompok = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kelompok ini?')) return
    
    try {
      const response = await fetch(`/api/kelompok?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast({ title: 'Berhasil', description: 'Kelompok berhasil dihapus' })
        fetchKelompok()
        fetchDesa()
      } else {
        throw new Error('Failed to delete kelompok')
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal menghapus kelompok', variant: 'destructive' })
    }
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Data Desa
            </CardTitle>
            <Button size="sm" onClick={() => setIsDesaFormOpen(true)}>
              <Plus className="mr-2 h-3 w-3" />
              Tambah
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {desa.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{item.nama_desa}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.kelompok_count} kelompok
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditingDesa(item)
                        setIsDesaFormOpen(true)
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteDesa(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Data Kelompok
            </CardTitle>
            <Button size="sm" onClick={() => setIsKelompokFormOpen(true)}>
              <Plus className="mr-2 h-3 w-3" />
              Tambah
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {kelompok.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{item.nama_kelompok}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.desa_name} • Putra: {item.target_putra} • Putri: {item.target_putri || 25}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditingKelompok(item)
                        setIsKelompokFormOpen(true)
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteKelompok(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pengaturan Kontak</h2>
        <ContactSettingsForm />
      </div>

      <DesaForm
        isOpen={isDesaFormOpen}
        onClose={() => {
          setIsDesaFormOpen(false)
          setEditingDesa(null)
        }}
        onSubmit={handleDesaSubmit}
        initialData={editingDesa || undefined}
        isLoading={isLoading}
      />

      <KelompokForm
        isOpen={isKelompokFormOpen}
        onClose={() => {
          setIsKelompokFormOpen(false)
          setEditingKelompok(null)
        }}
        onSubmit={handleKelompokSubmit}
        initialData={editingKelompok || undefined}
        desaList={desa}
        isLoading={isLoading}
      />
    </div>
  )
}