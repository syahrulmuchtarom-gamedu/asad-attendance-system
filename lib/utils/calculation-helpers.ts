import { AbsensiSummary } from '@/types'

export function calculateTotals(data: AbsensiSummary[]) {
  return data.reduce(
    (acc, item) => ({
      total_kelompok: acc.total_kelompok + item.total_kelompok,
      total_target_putra: acc.total_target_putra + item.total_target_putra,
      total_target_putri: acc.total_target_putri + item.total_target_putri,
      total_hadir_putra: acc.total_hadir_putra + item.total_hadir_putra,
      total_hadir_putri: acc.total_hadir_putri + item.total_hadir_putri,
    }),
    {
      total_kelompok: 0,
      total_target_putra: 0,
      total_target_putri: 0,
      total_hadir_putra: 0,
      total_hadir_putri: 0,
    }
  )
}

export function calculatePercentages(totals: ReturnType<typeof calculateTotals>) {
  const totalPersentasePutra = totals.total_target_putra > 0 
    ? (totals.total_hadir_putra / totals.total_target_putra) * 100 
    : 0

  const totalPersentasePutri = totals.total_target_putri > 0 
    ? (totals.total_hadir_putri / totals.total_target_putri) * 100 
    : 0

  return { totalPersentasePutra, totalPersentasePutri }
}