export function getPercentageColorClass(percentage: number): string {
  if (percentage >= 80) return 'text-green-600'
  if (percentage >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

export function getProgressColorClass(percentage: number): string {
  if (percentage >= 100) return 'bg-green-500'
  if (percentage >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}