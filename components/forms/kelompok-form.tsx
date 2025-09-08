'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

interface KelompokFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { nama_kelompok: string; desa_id: number; target_putra: number }) => void
  initialData?: { id?: number; nama_kelompok?: string; desa_id?: number; target_putra?: number }
  desaList: Array<{ id: number; nama_desa: string }>
  isLoading?: boolean
}

export function KelompokForm({ isOpen, onClose, onSubmit, initialData, desaList, isLoading }: KelompokFormProps) {
  const [namaKelompok, setNamaKelompok] = useState(initialData?.nama_kelompok || '')
  const [desaId, setDesaId] = useState<string>(initialData?.desa_id?.toString() || '')
  const [targetPutra, setTargetPutra] = useState(initialData?.target_putra?.toString() || '25')

  useEffect(() => {
    if (initialData) {
      setNamaKelompok(initialData.nama_kelompok || '')
      setDesaId(initialData.desa_id?.toString() || '')
      setTargetPutra(initialData.target_putra?.toString() || '25')
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!namaKelompok.trim() || !desaId || !targetPutra) return
    
    onSubmit({
      nama_kelompok: namaKelompok.trim(),
      desa_id: parseInt(desaId),
      target_putra: parseInt(targetPutra)
    })
  }

  const handleClose = () => {
    setNamaKelompok('')
    setDesaId('')
    setTargetPutra('25')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? 'Edit Kelompok' : 'Tambah Kelompok'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nama_kelompok">Nama Kelompok</Label>
              <Input
                id="nama_kelompok"
                value={namaKelompok}
                onChange={(e) => setNamaKelompok(e.target.value)}
                placeholder="Masukkan nama kelompok"
                required
              />
            </div>
            <div>
              <Label htmlFor="desa_id">Desa</Label>
              <Select value={desaId} onValueChange={setDesaId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih desa" />
                </SelectTrigger>
                <SelectContent>
                  {desaList.map((desa) => (
                    <SelectItem key={desa.id} value={desa.id.toString()}>
                      {desa.nama_desa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="target_putra">Target Putra</Label>
              <Input
                id="target_putra"
                type="number"
                value={targetPutra}
                onChange={(e) => setTargetPutra(e.target.value)}
                placeholder="25"
                min="1"
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading || !namaKelompok.trim() || !desaId || !targetPutra}>
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}