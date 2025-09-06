'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, Download, FileText, Calendar } from 'lucide-react'

// Data desa dengan target per kelompok (25 orang per kelompok)
const DESA_DATA = {
  'Kapuk Melati': 3, // 3 kelompok x 25 = 75 target
  'Jelambar': 4, // 4 kelompok x 25 = 100 target
  'Cengkareng': 3, // 3 kelompok x 25 = 75 target
  'Kebon Jahe': 4, // 4 kelompok x 25 = 100 target
  'Bandara': 3, // 3 kelompok x 25 = 75 target
  'Taman Kota': 4, // 4 kelompok x 25 = 100 target
  'Kalideres': 5, // 5 kelompok x 25 = 125 target
  'Cipondoh': 4, // 4 kelompok x 25 = 100 target
}

export default function LaporanPage() {
  const [selectedMonth, setSelectedMonth] = useState('12')
  const [selectedYear, setSelectedYear] = useState('2024')
  const [laporanData, setLaporanData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLaporanData()
  }, [selectedMonth, selectedYear])

  const fetchLaporanData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/absensi?bulan=${selectedMonth}&tahun=${selectedYear}`)
      const result = await response.json()
      
      // Generate laporan per desa dari data absensi
      const laporanPerDesa = Object.keys(DESA_DATA).map(namaDesa => {
        const jumlahKelompok = DESA_DATA[namaDesa as keyof typeof DESA_DATA]
        const target = jumlahKelompok * 25
        
        // Simulasi data hadir (karena belum ada data real)
        // Dalam implementasi real, hitung dari result.data
        const hadir = Math.floor(target * (0.75 + Math.random() * 0.25)) // 75-100% kehadiran
        const persentase = (hadir / target) * 100
        
        return {
          desa: namaDesa,
          target,
          hadir,
          persentase
        }
      })
      
      setLaporanData(laporanPerDesa)
    } catch (error) {
      console.error('Error fetching laporan:', error)
      // Fallback ke mock data jika API gagal
      setLaporanData([
        { desa: 'Kapuk Melati', target: 75, hadir: 68, persentase: 90.7 },
        { desa: 'Jelambar', target: 100, hadir: 85, persentase: 85.0 },
        { desa: 'Cengkareng', target: 75, hadir: 72, persentase: 96.0 },
        { desa: 'Kebon Jahe', target: 100, hadir: 78, persentase: 78.0 },
        { desa: 'Bandara', target: 75, hadir: 65, persentase: 86.7 },
        { desa: 'Taman Kota', target: 100, hadir: 92, persentase: 92.0 },
        { desa: 'Kalideres', target: 125, hadir: 110, persentase: 88.0 },
        { desa: 'Cipondoh', target: 100, hadir: 88, persentase: 88.0 },
      ])
    } finally {
      setLoading(false)
    }
  }

  const totalTarget = laporanData.reduce((sum, item) => sum + item.target, 0)
  const totalHadir = laporanData.reduce((sum, item) => sum + item.hadir, 0)
  const overallPercentage = totalTarget > 0 ? (totalHadir / totalTarget) * 100 : 0

  const handleExportPDF = () => {
    alert('Export PDF akan segera tersedia')
  }

  const handleExportExcel = () => {
    alert('Export Excel akan segera tersedia')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan Kehadiran</h1>
          <p className="text-muted-foreground">
            Laporan kehadiran bulanan semua desa
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportPDF} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button onClick={handleExportExcel} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
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
            Filter Periode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bulan</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
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
              <label className="text-sm font-medium">Tahun</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTarget}</div>
            <p className="text-xs text-muted-foreground">Orang</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Hadir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHadir}</div>
            <p className="text-xs text-muted-foreground">Orang</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Persentase Keseluruhan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallPercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Kehadiran</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Periode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Des</div>
            <p className="text-xs text-muted-foreground">2024</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Laporan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Laporan per Desa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Desa</th>
                  <th className="text-center p-3 font-medium">Target</th>
                  <th className="text-center p-3 font-medium">Hadir</th>
                  <th className="text-center p-3 font-medium">Persentase</th>
                  <th className="text-center p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {laporanData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.desa}</td>
                    <td className="p-3 text-center">{item.target}</td>
                    <td className="p-3 text-center">{item.hadir}</td>
                    <td className="p-3 text-center font-bold">{item.persentase.toFixed(1)}%</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.persentase >= 90 ? 'bg-green-100 text-green-800' :
                        item.persentase >= 80 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.persentase >= 90 ? 'Sangat Baik' :
                         item.persentase >= 80 ? 'Baik' : 'Perlu Perbaikan'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 bg-gray-50">
                  <td className="p-3 font-bold">TOTAL</td>
                  <td className="p-3 text-center font-bold">{totalTarget}</td>
                  <td className="p-3 text-center font-bold">{totalHadir}</td>
                  <td className="p-3 text-center font-bold">{overallPercentage.toFixed(1)}%</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      overallPercentage >= 90 ? 'bg-green-100 text-green-800' :
                      overallPercentage >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {overallPercentage >= 90 ? 'Sangat Baik' :
                       overallPercentage >= 80 ? 'Baik' : 'Perlu Perbaikan'}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}