'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

interface DesaFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { nama_desa: string }) => void
  initialData?: { id?: number; nama_desa?: string }
  isLoading?: boolean
}

export function DesaForm({ isOpen, onClose, onSubmit, initialData, isLoading }: DesaFormProps) {
  const [namaDesa, setNamaDesa] = useState(initialData?.nama_desa || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!namaDesa.trim()) return
    onSubmit({ nama_desa: namaDesa.trim() })
  }

  const handleClose = () => {
    setNamaDesa('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? 'Edit Desa' : 'Tambah Desa'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nama_desa">Nama Desa</Label>
              <Input
                id="nama_desa"
                value={namaDesa}
                onChange={(e) => setNamaDesa(e.target.value)}
                placeholder="Masukkan nama desa"
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading || !namaDesa.trim()}>
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}