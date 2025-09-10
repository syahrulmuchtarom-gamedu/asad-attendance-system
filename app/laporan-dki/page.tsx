'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, FileText, Calendar, BarChart3 } from 'lucide-react'

interface LaporanDKIData {
  bulan: number
  nama_bulan: string
  persentase_putra: number
  persentase_putri: number
  total_hadir_putra: number
  total_hadir_putri: number
  total_target_putra: number
  total_target_putri: number
}

export default function LaporanDKIPage() {
  const [selectedYear, setSelectedYear] = useState('2025')
  const [laporanData, setLaporanData] = useState<LaporanDKIData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLaporanData()
  }, [selectedYear])

  const fetchLaporanData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/laporan-dki?tahun=${selectedYear}`)
      const result = await response.json()
      
      if (response.ok && result.data) {
        setLaporanData(result.data)
      } else {
        setLaporanData([])
      }
    } catch (error) {
      console.error('Error fetching laporan DKI:', error)
      setLaporanData([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (persentase: number) => {
    if (persentase >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
    if (persentase >= 80) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  }

  const getStatusLabel = (persentase: number) => {
    if (persentase >= 90) return 'Sangat Baik'
    if (persentase >= 80) return 'Baik'
    return 'Perlu Perbaikan'
  }

  const calculateAverage = (type: 'putra' | 'putri') => {
    const dataWithValues = laporanData.filter(item => 
      type === 'putra' ? item.total_target_putra > 0 : item.total_target_putri > 0
    )
    
    if (dataWithValues.length === 0) return 0
    
    const sum = dataWithValues.reduce((acc, item) => 
      acc + (type === 'putra' ? item.persentase_putra : item.persentase_putri), 0
    )
    
    return Math.round((sum / dataWithValues.length) * 10) / 10
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan DKI Jakarta</h1>
          <p className="text-muted-foreground">
            Agregasi kehadiran putra dan putri seluruh Jakarta per bulan
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint}>
            <FileText className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filter Tahun
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tahun</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
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
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Putra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAverage('putra')}%</div>
            <p className="text-xs text-muted-foreground">Kehadiran tahun {selectedYear}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Putri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAverage('putri')}%</div>
            <p className="text-xs text-muted-foreground">Kehadiran tahun {selectedYear}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Laporan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Laporan Kehadiran DKI Jakarta - Tahun {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {laporanData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Belum ada data absensi untuk tahun {selectedYear}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Bulan</th>
                    <th className="text-center p-3 font-medium">Putra (%)</th>
                    <th className="text-center p-3 font-medium">Status Putra</th>
                    <th className="text-center p-3 font-medium">Putri (%)</th>
                    <th className="text-center p-3 font-medium">Status Putri</th>
                    <th className="text-center p-3 font-medium">Target Putra</th>
                    <th className="text-center p-3 font-medium">Hadir Putra</th>
                    <th className="text-center p-3 font-medium">Target Putri</th>
                    <th className="text-center p-3 font-medium">Hadir Putri</th>
                  </tr>
                </thead>
                <tbody>
                  {laporanData.map((item) => (
                    <tr key={item.bulan} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{item.nama_bulan}</td>
                      <td className="p-3 text-center font-bold">{item.persentase_putra}%</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.persentase_putra)}`}>
                          {getStatusLabel(item.persentase_putra)}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold">{item.persentase_putri}%</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.persentase_putri)}`}>
                          {getStatusLabel(item.persentase_putri)}
                        </span>
                      </td>
                      <td className="p-3 text-center">{item.total_target_putra}</td>
                      <td className="p-3 text-center">{item.total_hadir_putra}</td>
                      <td className="p-3 text-center">{item.total_target_putri}</td>
                      <td className="p-3 text-center">{item.total_hadir_putri}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 bg-muted/50 font-bold">
                    <td className="p-3">RATA-RATA</td>
                    <td className="p-3 text-center">{calculateAverage('putra')}%</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(calculateAverage('putra'))}`}>
                        {getStatusLabel(calculateAverage('putra'))}
                      </span>
                    </td>
                    <td className="p-3 text-center">{calculateAverage('putri')}%</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(calculateAverage('putri'))}`}>
                        {getStatusLabel(calculateAverage('putri'))}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {laporanData.reduce((sum, item) => sum + item.total_target_putra, 0)}
                    </td>
                    <td className="p-3 text-center">
                      {laporanData.reduce((sum, item) => sum + item.total_hadir_putra, 0)}
                    </td>
                    <td className="p-3 text-center">
                      {laporanData.reduce((sum, item) => sum + item.total_target_putri, 0)}
                    </td>
                    <td className="p-3 text-center">
                      {laporanData.reduce((sum, item) => sum + item.total_hadir_putri, 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}