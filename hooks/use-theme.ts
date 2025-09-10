'use client'

import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export interface ThemeConfig {
  theme: string | undefined
  setTheme: (theme: string) => void
  resolvedTheme: string | undefined
  themes: string[]
  systemTheme: string | undefined
  isDark: boolean
  isLight: boolean
  isSystem: boolean
  mounted: boolean
}

export function useTheme(): ThemeConfig {
  const {
    theme,
    setTheme,
    resolvedTheme,
    themes,
    systemTheme
  } = useNextTheme()
  
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    theme,
    setTheme,
    resolvedTheme,
    themes,
    systemTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system',
    mounted
  }
}

// Theme-aware utility functions
export const getThemeAwareColor = (lightColor: string, darkColor: string, isDark: boolean) => {
  return isDark ? darkColor : lightColor
}

export const getContrastColor = (isDark: boolean) => {
  return isDark ? '#f5f5f5' : '#1a1a1a'
}

export const getBackgroundColor = (isDark: boolean, level: 'primary' | 'secondary' | 'tertiary' = 'primary') => {
  if (isDark) {
    switch (level) {
      case 'primary': return '#1a1a1a'
      case 'secondary': return '#2a2a2a'
      case 'tertiary': return '#3a3a3a'
      default: return '#1a1a1a'
    }
  } else {
    switch (level) {
      case 'primary': return '#ffffff'
      case 'secondary': return '#f8f9fa'
      case 'tertiary': return '#f1f3f4'
      default: return '#ffffff'
    }
  }
}