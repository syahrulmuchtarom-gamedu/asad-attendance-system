import { AbsensiSummary } from '@/types'
import { formatPercentage } from '@/lib/utils'
import { getPercentageColorClass } from '@/lib/utils/color-helpers'
import { TABLE_CELL_CLASSES, TABLE_CELL_CENTER_CLASSES } from '@/components/ui/table-styles'

interface TableRowProps {
  item: AbsensiSummary
}

export function TableRow({ item }: TableRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className={`${TABLE_CELL_CLASSES} font-medium`}>
        {item.nama_desa}
      </td>
      <td className={TABLE_CELL_CENTER_CLASSES}>
        {item.total_kelompok}
      </td>
      <td className={TABLE_CELL_CENTER_CLASSES}>
        {item.total_target_putra}
      </td>
      <td className={TABLE_CELL_CENTER_CLASSES}>
        {item.total_hadir_putra}
      </td>
      <td className={TABLE_CELL_CENTER_CLASSES}>
        <span className={`font-medium ${getPercentageColorClass(item.persentase_putra)}`}>
          {formatPercentage(item.persentase_putra)}
        </span>
      </td>
      <td className={TABLE_CELL_CENTER_CLASSES}>
        {item.total_target_putri}
      </td>
      <td className={TABLE_CELL_CENTER_CLASSES}>
        {item.total_hadir_putri}
      </td>
      <td className={TABLE_CELL_CENTER_CLASSES}>
        <span className={`font-medium ${getPercentageColorClass(item.persentase_putri)}`}>
          {formatPercentage(item.persentase_putri)}
        </span>
      </td>
    </tr>
  )
}