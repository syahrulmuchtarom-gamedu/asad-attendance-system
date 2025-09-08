'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, Download, FileText, Calendar, Users } from 'lucide-react'

const mockLaporanDesa = [
  { kelompok: 'Melati A', target_putra: 25, hadir_putra: 23, target_putri: 0, hadir_putri: 0, persentase: 92.0 },
  { kelompok: 'Melati B', target_putra: 25, hadir_putra: 22, target_putri: 0, hadir_putri: 0, persentase: 88.0 },
  { kelompok: 'BGN', target_putra: 25, hadir_putra: 23, target_putri: 0, hadir_putri: 0, persentase: 92.0 },
]

export default function LaporanDesaPage() {
  const [selectedMonth, setSelectedMonth] = useState('12')
  const [selectedYear, setSelectedYear] = useState('2025')

  const totalTargetPutra = mockLaporanDesa.reduce((sum, item) => sum + item.target_putra, 0)
  const totalHadirPutra = mockLaporanDesa.reduce((sum, item) => sum + item.hadir_putra, 0)
  const overallPercentage = (totalHadirPutra / totalTargetPutra) * 100

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
          <h1 className="text-3xl font-bold tracking-tight">Laporan Desa</h1>
          <p className="text-muted-foreground">
            Laporan kehadiran kelompok di desa Kapuk Melati
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Kelompok</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLaporanDesa.length}</div>
            <p className="text-xs text-muted-foreground">Kelompok</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Target Putra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTargetPutra}</div>
            <p className="text-xs text-muted-foreground">Orang</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hadir Putra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHadirPutra}</div>
            <p className="text-xs text-muted-foreground">Orang</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Persentase Desa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallPercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Kehadiran</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Laporan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Laporan per Kelompok
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Kelompok</th>
                  <th className="text-center p-3 font-medium">Target Putra</th>
                  <th className="text-center p-3 font-medium">Hadir Putra</th>
                  <th className="text-center p-3 font-medium">Target Putri</th>
                  <th className="text-center p-3 font-medium">Hadir Putri</th>
                  <th className="text-center p-3 font-medium">Persentase</th>
                  <th className="text-center p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockLaporanDesa.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.kelompok}</td>
                    <td className="p-3 text-center">{item.target_putra}</td>
                    <td className="p-3 text-center">{item.hadir_putra}</td>
                    <td className="p-3 text-center">{item.target_putri}</td>
                    <td className="p-3 text-center">{item.hadir_putri}</td>
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
                  <td className="p-3 text-center font-bold">{totalTargetPutra}</td>
                  <td className="p-3 text-center font-bold">{totalHadirPutra}</td>
                  <td className="p-3 text-center font-bold">0</td>
                  <td className="p-3 text-center font-bold">0</td>
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