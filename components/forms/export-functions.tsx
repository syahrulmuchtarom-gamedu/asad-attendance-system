'use client'

import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { AbsensiSummary } from '@/types'
import { formatPercentage, getMonthName } from '@/lib/utils'
import { calculateTotals, calculatePercentages } from '@/lib/utils/calculation-helpers'

export const exportToPDF = (data: AbsensiSummary[], bulan: number, tahun: number) => {
  try {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(16)
    doc.text('LAPORAN ABSENSI KELOMPOK ASAD', 105, 20, { align: 'center' })
    doc.setFontSize(12)
    doc.text(`Periode: ${getMonthName(bulan)} ${tahun}`, 105, 30, { align: 'center' })
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 105, 40, { align: 'center' })

    // Table data
    const tableData = data.map(item => [
      item.nama_desa,
      item.total_kelompok.toString(),
      item.total_target_putra.toString(),
      item.total_hadir_putra.toString(),
      formatPercentage(item.persentase_putra),
      item.total_target_putri.toString(),
      item.total_hadir_putri.toString(),
      formatPercentage(item.persentase_putri)
    ])

    // Calculate totals
    const totals = calculateTotals(data)
    const { totalPersentasePutra, totalPersentasePutri } = calculatePercentages(totals)

    // Add totals row
    tableData.push([
      'TOTAL',
      totals.total_kelompok.toString(),
      totals.total_target_putra.toString(),
      totals.total_hadir_putra.toString(),
      formatPercentage(totalPersentasePutra),
      totals.total_target_putri.toString(),
      totals.total_hadir_putri.toString(),
      formatPercentage(totalPersentasePutri)
    ])

    // Add table
    ;(doc as any).autoTable({
      head: [['Desa', 'Kelompok', 'Target Putra', 'Hadir Putra', '% Putra', 'Target Putri', 'Hadir Putri', '% Putri']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    })

    doc.save(`laporan-absensi-${getMonthName(bulan).toLowerCase()}-${tahun}.pdf`)
  } catch (error) {
    console.error('Error exporting PDF:', error)
    throw new Error('Gagal export PDF')
  }
}

export const exportToExcel = (data: AbsensiSummary[], bulan: number, tahun: number) => {
  try {
    // Prepare data
    const excelData = data.map(item => ({
      'Desa': item.nama_desa,
      'Jumlah Kelompok': item.total_kelompok,
      'Target Putra': item.total_target_putra,
      'Hadir Putra': item.total_hadir_putra,
      'Persentase Putra': `${item.persentase_putra.toFixed(1)}%`,
      'Target Putri': item.total_target_putri,
      'Hadir Putri': item.total_hadir_putri,
      'Persentase Putri': `${item.persentase_putri.toFixed(1)}%`
    }))

    // Calculate totals
    const totals = calculateTotals(data)
    const { totalPersentasePutra, totalPersentasePutri } = calculatePercentages(totals)

    // Add totals row
    excelData.push({
      'Desa': 'TOTAL',
      'Jumlah Kelompok': totals.total_kelompok,
      'Target Putra': totals.total_target_putra,
      'Hadir Putra': totals.total_hadir_putra,
      'Persentase Putra': `${totalPersentasePutra.toFixed(1)}%`,
      'Target Putri': totals.total_target_putri,
      'Hadir Putri': totals.total_hadir_putri,
      'Persentase Putri': `${totalPersentasePutri.toFixed(1)}%`
    })

    // Create workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(excelData)

    // Add title rows
    XLSX.utils.sheet_add_aoa(ws, [
      ['LAPORAN ABSENSI KELOMPOK ASAD'],
      [`Periode: ${getMonthName(bulan)} ${tahun}`],
      [`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`],
      []
    ], { origin: 'A1' })

    // Adjust column widths
    const colWidths = [
      { wch: 15 }, // Desa
      { wch: 12 }, // Jumlah Kelompok
      { wch: 12 }, // Target Putra
      { wch: 12 }, // Hadir Putra
      { wch: 15 }, // Persentase Putra
      { wch: 12 }, // Target Putri
      { wch: 12 }, // Hadir Putri
      { wch: 15 }  // Persentase Putri
    ]
    ws['!cols'] = colWidths

    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Absensi')
    XLSX.writeFile(wb, `laporan-absensi-${getMonthName(bulan).toLowerCase()}-${tahun}.xlsx`)
  } catch (error) {
    console.error('Error exporting Excel:', error)
    throw new Error('Gagal export Excel')
  }
}