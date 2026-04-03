import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeSwitcher } from '../components/ThemeSwitcher/ThemeSwitcher'
import { THEMES } from '../hooks/useTheme'

describe('ThemeSwitcher', () => {
  it('renders all themes', () => {
    render(<ThemeSwitcher currentThemeId="dark" onSelect={vi.fn()} />)
    for (const theme of THEMES) {
      expect(screen.getByTestId(`theme-${theme.id}`)).toBeInTheDocument()
    }
  })

  it('highlights active theme', () => {
    render(<ThemeSwitcher currentThemeId="light" onSelect={vi.fn()} />)
    expect(screen.getByTestId('theme-light').className).toMatch(/active/)
    expect(screen.getByTestId('theme-dark').className).not.toMatch(/active/)
  })

  it('calls onSelect when theme clicked', () => {
    const onSelect = vi.fn()
    render(<ThemeSwitcher currentThemeId="dark" onSelect={onSelect} />)
    fireEvent.click(screen.getByTestId('theme-forest'))
    expect(onSelect).toHaveBeenCalledWith('forest')
  })

  it('has accessible labels', () => {
    render(<ThemeSwitcher currentThemeId="dark" onSelect={vi.fn()} />)
    expect(screen.getByLabelText('Theme: Dark')).toBeInTheDocument()
    expect(screen.getByLabelText('Theme: Light')).toBeInTheDocument()
  })
})

describe('useTheme themes config', () => {
  it('has 4 themes defined', () => {
    expect(THEMES).toHaveLength(4)
  })

  it('all themes have required properties', () => {
    for (const theme of THEMES) {
      expect(theme.id).toBeTruthy()
      expect(theme.name).toBeTruthy()
      expect(theme.darkSquare).toMatch(/^#/)
      expect(theme.lightSquare).toMatch(/^#/)
      expect(Object.keys(theme.vars).length).toBeGreaterThan(0)
    }
  })
})
