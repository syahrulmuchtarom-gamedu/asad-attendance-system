import { formatPercentage } from '@/lib/utils'
import { getPercentageColorClass } from '@/lib/utils/color-helpers'
import { TABLE_CELL_CLASSES, TABLE_CELL_CENTER_CLASSES } from '@/components/ui/table-styles'

interface TotalRowProps {
  totals: {
    total_kelompok: number
    total_target_putra: number
    total_target_putri: number
    total_hadir_putra: number
    total_hadir_putri: number
  }
  totalPersentasePutra: number
  totalPersentasePutri: number
}

export function TotalRow({ totals, totalPersentasePutra, totalPersentasePutri }: TotalRowProps) {
  return (
    <tr className="bg-blue-50 font-bold">
      <td className={TABLE_CELL_CLASSES}>TOTAL</td>
      <td className={TABLE_CELL_CENTER_CLASSES}>
        {totals.total_kelompok}
      </td>
      <td className={TABLE_CELL_CENTER_CLASSES}>
        {totals.total_target_putra}
      </td>
      <td className={TABLE_CELL_CENTER_CLASSES}>
        {totals.total_hadir_putra}
      </td>
      <td className={TABLE_CELL_CENTER_CLASSES}>
        <span className={getPercentageColorClass(totalPersentasePutra)}>
          {formatPercentage(totalPersentasePutra)}
        </span>
      </td>
      <td className={TABLE_CELL_CENTER_CLASSES}>
        {totals.total_target_putri}
      </td>
      <td className={TABLE_CELL_CENTER_CLASSES}>
        {totals.total_hadir_putri}
      </td>
      <td className={TABLE_CELL_CENTER_CLASSES}>
        <span className={getPercentageColorClass(totalPersentasePutri)}>
          {formatPercentage(totalPersentasePutri)}
        </span>
      </td>
    </tr>
  )
}