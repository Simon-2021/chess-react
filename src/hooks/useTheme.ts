import { useState, useEffect, useCallback } from 'react'

export type ThemeId = 'dark' | 'light' | 'forest' | 'ocean'

export interface Theme {
  id: ThemeId
  name: string
  emoji: string
  darkSquare: string
  lightSquare: string
  vars: Record<string, string>
}

export const THEMES: Theme[] = [
  {
    id: 'dark',
    name: 'Dark',
    emoji: '🌙',
    darkSquare: '#b58863',
    lightSquare: '#f0d9b5',
    vars: {
      '--bg-primary': '#1a1a2e',
      '--bg-secondary': '#16213e',
      '--panel-bg': '#1e2a3a',
      '--border-color': '#2d3f50',
      '--text-primary': '#e8e8f0',
      '--text-secondary': '#b8bcc8',
      '--text-muted': '#6b7a8d',
      '--accent-color': '#4a9eff',
      '--accent-hover': '#3a8ee0',
    },
  },
  {
    id: 'light',
    name: 'Light',
    emoji: '☀️',
    darkSquare: '#769656',
    lightSquare: '#eeeed2',
    vars: {
      '--bg-primary': '#f5f5f5',
      '--bg-secondary': '#ffffff',
      '--panel-bg': '#ffffff',
      '--border-color': '#d0d0d0',
      '--text-primary': '#1a1a1a',
      '--text-secondary': '#444444',
      '--text-muted': '#888888',
      '--accent-color': '#1565c0',
      '--accent-hover': '#0d47a1',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    emoji: '🌿',
    darkSquare: '#4a7c59',
    lightSquare: '#d4e8c2',
    vars: {
      '--bg-primary': '#1b2e1f',
      '--bg-secondary': '#162418',
      '--panel-bg': '#1e3022',
      '--border-color': '#2d4a30',
      '--text-primary': '#e0f0e0',
      '--text-secondary': '#a8c8a8',
      '--text-muted': '#6b8a6b',
      '--accent-color': '#66bb6a',
      '--accent-hover': '#4caf50',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🌊',
    darkSquare: '#4a6fa5',
    lightSquare: '#c9d8f0',
    vars: {
      '--bg-primary': '#0a1628',
      '--bg-secondary': '#0d1f3c',
      '--panel-bg': '#10254a',
      '--border-color': '#1a3a6a',
      '--text-primary': '#d0e8ff',
      '--text-secondary': '#88b8e8',
      '--text-muted': '#4a7aaa',
      '--accent-color': '#29b6f6',
      '--accent-hover': '#0288d1',
    },
  },
]

const STORAGE_KEY = 'chess-react-theme'

function loadTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && THEMES.find((t) => t.id === saved)) {
      return saved as ThemeId
    }
  } catch {
    // ignore
  }
  return 'dark'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value)
  }
}

export function useTheme() {
  const [themeId, setThemeId] = useState<ThemeId>(loadTheme)

  const currentTheme = THEMES.find((t) => t.id === themeId) ?? THEMES[0]

  // Apply theme on mount and change
  useEffect(() => {
    applyTheme(currentTheme)
    try {
      localStorage.setItem(STORAGE_KEY, themeId)
    } catch {
      // ignore
    }
  }, [themeId, currentTheme])

  const selectTheme = useCallback((id: ThemeId) => {
    setThemeId(id)
  }, [])

  return { themeId, currentTheme, themes: THEMES, selectTheme }
}
