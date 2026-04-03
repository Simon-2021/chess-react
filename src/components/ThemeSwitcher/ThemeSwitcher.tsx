import { THEMES } from '../../hooks/useTheme'
import type { ThemeId } from '../../hooks/useTheme'
import styles from './ThemeSwitcher.module.css'

interface ThemeSwitcherProps {
  currentThemeId: ThemeId
  onSelect: (id: ThemeId) => void
}

export function ThemeSwitcher({ currentThemeId, onSelect }: ThemeSwitcherProps) {
  return (
    <div className={styles.container} data-testid="theme-switcher">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          className={`${styles.btn} ${currentThemeId === theme.id ? styles.active : ''}`}
          onClick={() => onSelect(theme.id)}
          title={theme.name}
          aria-label={`Theme: ${theme.name}`}
          data-testid={`theme-${theme.id}`}
        >
          <span className={styles.emoji}>{theme.emoji}</span>
          <span className={styles.label}>{theme.name}</span>
        </button>
      ))}
    </div>
  )
}
