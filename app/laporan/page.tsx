'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { exportToPDF, exportToExcel } from '@/components/forms/export-functions'
import { BarChart3, Download, FileText, Calendar, X } from 'lucide-react'

export default function LaporanPage() {
  const [selectedMonth, setSelectedMonth] = useState('12')
  const [selectedYear, setSelectedYear] = useState('2025')
  const [laporanData, setLaporanData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [detailData, setDetailData] = useState<any[]>([])
  const [selectedDesa, setSelectedDesa] = useState('')
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetchLaporanData()
  }, [selectedMonth, selectedYear])

  const fetchLaporanData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/laporan?bulan=${selectedMonth}&tahun=${selectedYear}`)
      const result = await response.json()
      
      if (response.ok && result.data && result.data.length > 0) {
        // Data sudah di-aggregate dari API
        setLaporanData(result.data)
      } else {
        // Jika belum ada data, tampilkan pesan kosong
        setLaporanData([])
      }
    } catch (error) {
      console.error('Error fetching laporan:', error)
      setLaporanData([])
    } finally {
      setLoading(false)
    }
  }

  const totalTarget = laporanData.reduce((sum, item) => sum + (item.target || 0), 0)
  const totalHadir = laporanData.reduce((sum, item) => sum + (item.hadir || 0), 0)
  const overallPercentage = totalTarget > 0 ? (totalHadir / totalTarget) * 100 : 0

  const handleExportPDF = () => {
    try {
      if (laporanData.length === 0) {
        alert('Tidak ada data untuk diekspor')
        return
      }
      
      // Transform data untuk export
      const exportData = laporanData.map((item, index) => ({
        desa_id: index + 1,
        nama_desa: item.desa,
        total_kelompok: item.kelompok_count || 1,
        total_target_putra: Math.floor(item.target / 2),
        total_hadir_putra: Math.floor(item.hadir / 2),
        persentase_putra: item.target > 0 ? (Math.floor(item.hadir / 2) / Math.floor(item.target / 2)) * 100 : 0,
        total_target_putri: Math.ceil(item.target / 2),
        total_hadir_putri: Math.ceil(item.hadir / 2),
        persentase_putri: item.target > 0 ? (Math.ceil(item.hadir / 2) / Math.ceil(item.target / 2)) * 100 : 0
      }))
      
      exportToPDF(exportData, parseInt(selectedMonth), parseInt(selectedYear))
    } catch (error) {
      alert('Gagal export PDF: ' + (error as Error).message)
    }
  }

  const handleExportExcel = () => {
    try {
      if (laporanData.length === 0) {
        alert('Tidak ada data untuk diekspor')
        return
      }
      
      // Transform data untuk export
      const exportData = laporanData.map((item, index) => ({
        desa_id: index + 1,
        nama_desa: item.desa,
        total_kelompok: item.kelompok_count || 1,
        total_target_putra: Math.floor(item.target / 2),
        total_hadir_putra: Math.floor(item.hadir / 2),
        persentase_putra: item.target > 0 ? (Math.floor(item.hadir / 2) / Math.floor(item.target / 2)) * 100 : 0,
        total_target_putri: Math.ceil(item.target / 2),
        total_hadir_putri: Math.ceil(item.hadir / 2),
        persentase_putri: item.target > 0 ? (Math.ceil(item.hadir / 2) / Math.ceil(item.target / 2)) * 100 : 0
      }))
      
      exportToExcel(exportData, parseInt(selectedMonth), parseInt(selectedYear))
    } catch (error) {
      alert('Gagal export Excel: ' + (error as Error).message)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDesaClick = async (desaName: string) => {
    try {
      setDetailLoading(true)
      setSelectedDesa(desaName)
      setModalOpen(true)
      
      const response = await fetch(`/api/laporan/detail?desa=${encodeURIComponent(desaName)}&bulan=${selectedMonth}&tahun=${selectedYear}`)
      const result = await response.json()
      
      if (response.ok && result.data) {
        setDetailData(result.data)
      } else {
        setDetailData([])
      }
    } catch (error) {
      console.error('Error fetching detail data:', error)
      setDetailData([])
    } finally {
      setDetailLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
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
            <div className="text-2xl font-bold">{selectedMonth}</div>
            <p className="text-xs text-muted-foreground">{selectedYear}</p>
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
          {laporanData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Belum ada data absensi untuk periode {selectedMonth}/{selectedYear}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Silakan input data absensi terlebih dahulu
              </p>
            </div>
          ) : (
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
                  {laporanData.map((item, index) => {
                    const persentase = item.target > 0 ? (item.hadir / item.target) * 100 : 0
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">
                          <button 
                            onClick={() => handleDesaClick(item.desa)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            {item.desa}
                          </button>
                        </td>
                        <td className="p-3 text-center">{item.target}</td>
                        <td className="p-3 text-center">{item.hadir}</td>
                        <td className="p-3 text-center font-bold">{persentase.toFixed(1)}%</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            persentase >= 90 ? 'bg-green-100 text-green-800' :
                            persentase >= 80 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {persentase >= 90 ? 'Sangat Baik' :
                             persentase >= 80 ? 'Baik' : 'Perlu Perbaikan'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                {laporanData.length > 0 && (
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
                )}
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Detail Desa */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detail Desa {selectedDesa} - {selectedMonth}/{selectedYear}
            </DialogTitle>
          </DialogHeader>
          
          {detailLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p>Loading detail data...</p>
              </div>
            </div>
          ) : detailData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada data detail untuk desa ini</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">Kelompok</th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-medium">Target Putra</th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-medium">Hadir Putra</th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-medium">Target Putri</th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-medium">Hadir Putri</th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-medium">Total Target</th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-medium">Total Hadir</th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-medium">Persentase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailData.map((item, index) => {
                      const persentase = item.total_target > 0 ? (item.total_hadir / item.total_target) * 100 : 0
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-medium">{item.kelompok}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{item.target_putra}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{item.hadir_putra}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{item.target_putri}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{item.hadir_putri}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center font-bold">{item.total_target}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center font-bold">{item.total_hadir}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center font-bold">{persentase.toFixed(1)}%</td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td className="border border-gray-300 px-4 py-2">TOTAL {selectedDesa.toUpperCase()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {detailData.reduce((sum, item) => sum + item.target_putra, 0)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {detailData.reduce((sum, item) => sum + item.hadir_putra, 0)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {detailData.reduce((sum, item) => sum + item.target_putri, 0)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {detailData.reduce((sum, item) => sum + item.hadir_putri, 0)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {detailData.reduce((sum, item) => sum + item.total_target, 0)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {detailData.reduce((sum, item) => sum + item.total_hadir, 0)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {(() => {
                          const totalTarget = detailData.reduce((sum, item) => sum + item.total_target, 0)
                          const totalHadir = detailData.reduce((sum, item) => sum + item.total_hadir, 0)
                          return totalTarget > 0 ? ((totalHadir / totalTarget) * 100).toFixed(1) : 0
                        })()}%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}