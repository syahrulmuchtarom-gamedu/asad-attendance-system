'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Download, FileText, Printer } from 'lucide-react'
import { AbsensiSummary } from '@/types'
import { formatPercentage, getMonthName } from '@/lib/utils'
import { exportToPDF, exportToExcel } from '@/components/forms/export-functions'
import { calculateTotals, calculatePercentages } from '@/lib/utils/calculation-helpers'
import { TableRow } from '@/components/tables/table-row'
import { TotalRow } from '@/components/tables/total-row'
import { TABLE_HEADER_CLASSES, TABLE_HEADER_CENTER_CLASSES } from '@/components/ui/table-styles'
import { MONTHS, CURRENT_YEAR } from '@/lib/constants'

interface AbsensiTableProps {
  data: AbsensiSummary[]
  bulan: number
  tahun: number
  onFilterChange: (bulan: number, tahun: number) => void
  showExport?: boolean
}

export function AbsensiTable({ 
  data, 
  bulan, 
  tahun, 
  onFilterChange, 
  showExport = true 
}: AbsensiTableProps) {
  const [filterBulan, setFilterBulan] = useState(bulan)
  const [filterTahun, setFilterTahun] = useState(tahun)

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange(filterBulan, filterTahun)
  }

  const handleExportPDF = () => {
    try {
      exportToPDF(data, bulan, tahun)
    } catch (error) {
      console.error('Export PDF failed:', error)
    }
  }

  const handleExportExcel = () => {
    try {
      exportToExcel(data, bulan, tahun)
    } catch (error) {
      console.error('Export Excel failed:', error)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // Calculate totals with memoization
  const totals = useMemo(() => calculateTotals(data), [data])
  const { totalPersentasePutra, totalPersentasePutri } = useMemo(() => calculatePercentages(totals), [totals])

  return (
    <div className="space-y-6">
      {/* Filter */}
      <Card className="print-hidden">
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
          <CardDescription>
            Pilih periode untuk melihat data absensi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFilterSubmit} className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="filter-bulan">Bulan</Label>
              <select
                id="filter-bulan"
                value={filterBulan}
                onChange={(e) => setFilterBulan(Number(e.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-tahun">Tahun</Label>
              <select
                id="filter-tahun"
                value={filterTahun}
                onChange={(e) => setFilterTahun(Number(e.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit">
              Tampilkan
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Export Actions */}
      {showExport && (
        <div className="flex gap-2 print-hidden">
          <Button onClick={handleExportPDF} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={handleExportExcel} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      )}

      {/* Report Header - Print Only */}
      <div className="print-only text-center mb-6">
        <h1 className="text-2xl font-bold">LAPORAN ABSENSI KELOMPOK ASAD</h1>
        <h2 className="text-xl">Periode: {getMonthName(bulan)} {tahun}</h2>
        <p className="text-sm mt-2">Dicetak pada: {new Date().toLocaleDateString('id-ID')}</p>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="print-hidden">
          <CardTitle>
            Laporan Absensi - {getMonthName(bulan)} {tahun}
          </CardTitle>
          <CardDescription>
            Data kehadiran per desa dan kelompok
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className={TABLE_HEADER_CLASSES}>Desa</th>
                  <th className={TABLE_HEADER_CENTER_CLASSES}>Kelompok</th>
                  <th className={TABLE_HEADER_CENTER_CLASSES}>Target Putra</th>
                  <th className={TABLE_HEADER_CENTER_CLASSES}>Hadir Putra</th>
                  <th className={TABLE_HEADER_CENTER_CLASSES}>% Putra</th>
                  <th className={TABLE_HEADER_CENTER_CLASSES}>Target Putri</th>
                  <th className={TABLE_HEADER_CENTER_CLASSES}>Hadir Putri</th>
                  <th className={TABLE_HEADER_CENTER_CLASSES}>% Putri</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  <>
                    {data.map((item) => (
                      <TableRow key={item.desa_id} item={item} />
                    ))}
                    <TotalRow 
                      totals={totals}
                      totalPersentasePutra={totalPersentasePutra}
                      totalPersentasePutri={totalPersentasePutri}
                    />
                  </>
                ) : (
                  <tr>
                    <td colSpan={8} className="border border-gray-300 px-4 py-8 text-center text-muted-foreground">
                      Tidak ada data untuk periode ini
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
