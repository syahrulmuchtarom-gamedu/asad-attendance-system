'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Calendar, Save } from 'lucide-react'

interface Kelompok {
  id: number
  nama_kelompok: string
  target_putra: number
  target_putri: number
}

export default function AbsensiPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(2025)
  const [kelompokList, setKelompokList] = useState<Kelompok[]>([])
  const [absensiData, setAbsensiData] = useState<{[key: number]: {hadir_putra: number, hadir_putri: number}}>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch kelompok berdasarkan desa user
    const fetchKelompok = async () => {
      try {
        const response = await fetch('/api/kelompok')
        if (response.ok) {
          const data = await response.json()
          setKelompokList(data)
        }
      } catch (error) {
        console.error('Error fetching kelompok:', error)
      }
    }
    
    fetchKelompok()
  }, [])

  const handleInputChange = (kelompokId: number, field: 'hadir_putra' | 'hadir_putri', value: string) => {
    const numValue = parseInt(value) || 0
    setAbsensiData(prev => ({
      ...prev,
      [kelompokId]: {
        ...prev[kelompokId],
        [field]: numValue
      }
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      
      for (const kelompok of kelompokList) {
        const data = absensiData[kelompok.id]
        if (data && (data.hadir_putra > 0 || data.hadir_putri > 0)) {
          const response = await fetch('/api/absensi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              kelompok_id: kelompok.id,
              bulan: selectedMonth,
              tahun: selectedYear,
              hadir_putra: data.hadir_putra || 0,
              hadir_putri: data.hadir_putri || 0
            })
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error)
          }
        }
      }

      alert('Data absensi berhasil disimpan!')
      setAbsensiData({})
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getTotalTarget = () => {
    return kelompokList.reduce((sum, k) => sum + k.target_putra + k.target_putri, 0)
  }

  const getTotalHadir = () => {
    return Object.values(absensiData).reduce((sum, data) => 
      sum + (data?.hadir_putra || 0) + (data?.hadir_putri || 0), 0
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Input Absensi</h1>
        <p className="text-muted-foreground">
          Input data kehadiran bulanan per kelompok
        </p>
      </div>

      {/* Filter Periode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Periode Absensi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label>Bulan</Label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Januari</SelectItem>
                  <SelectItem value="2">Februari</SelectItem>
                  <SelectItem value="3">Maret</SelectItem>
                  <SelectItem value="4">April</SelectItem>
                  <SelectItem value="5">Mei</SelectItem>
                  <SelectItem value="6">Juni</SelectItem>
                  <SelectItem value="7">Juli</SelectItem>
                  <SelectItem value="8">Agustus</SelectItem>
                  <SelectItem value="9">September</SelectItem>
                  <SelectItem value="10">Oktober</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">Desember</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tahun</Label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 16 }, (_, i) => {
                    const year = 2025 + i
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalTarget()}</div>
            <p className="text-xs text-muted-foreground">Orang</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Input</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalHadir()}</div>
            <p className="text-xs text-muted-foreground">Orang</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Persentase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTotalTarget() > 0 ? ((getTotalHadir() / getTotalTarget()) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Kehadiran</p>
          </CardContent>
        </Card>
      </div>

      {/* Form Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Input Data Kehadiran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kelompokList.map((kelompok) => (
              <div key={kelompok.id} className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">{kelompok.nama_kelompok}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Hadir Putra (Target: {kelompok.target_putra})</Label>
                    <Input
                      type="number"
                      min="0"
                      max={kelompok.target_putra}
                      value={absensiData[kelompok.id]?.hadir_putra || ''}
                      onChange={(e) => handleInputChange(kelompok.id, 'hadir_putra', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Hadir Putri (Target: {kelompok.target_putri})</Label>
                    <Input
                      type="number"
                      min="0"
                      max={kelompok.target_putri}
                      value={absensiData[kelompok.id]?.hadir_putri || ''}
                      onChange={(e) => handleInputChange(kelompok.id, 'hadir_putri', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Menyimpan...' : 'Simpan Data'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}