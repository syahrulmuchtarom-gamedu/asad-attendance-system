import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

function parseDate(date: string | Date): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date')
  }
  return dateObj
}

export function formatDate(date: string | Date): string {
  try {
    const dateObj = parseDate(date)
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj)
  } catch {
    return 'Tanggal tidak valid'
  }
}

export function formatDateTime(date: string | Date): string {
  try {
    const dateObj = parseDate(date)
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  } catch {
    return 'Tanggal tidak valid'
  }
}

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

export function getMonthName(month: number): string {
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}. Month must be between 1 and 12.`)
  }
  return MONTHS[month - 1]
}

export function calculatePercentage(hadir: number, target: number): number {
  if (typeof hadir !== 'number' || typeof target !== 'number') {
    throw new Error('Both hadir and target must be numbers')
  }
  if (hadir < 0 || target < 0) {
    throw new Error('Both hadir and target must be non-negative')
  }
  if (target === 0) return 0
  return (hadir / target) * 100
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>"'&]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}