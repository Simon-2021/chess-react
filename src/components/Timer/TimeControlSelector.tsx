import type { TimeControl } from '../../hooks/useGameTimer'
import styles from './TimeControlSelector.module.css'

interface TimeControlSelectorProps {
  current: TimeControl
  onChange: (tc: TimeControl) => void
}

const TIME_CONTROLS: { value: TimeControl; label: string; desc: string }[] = [
  { value: 'unlimited', label: '∞', desc: 'Unlimited' },
  { value: 3, label: '3', desc: 'Blitz' },
  { value: 5, label: '5', desc: 'Blitz' },
  { value: 10, label: '10', desc: 'Rapid' },
  { value: 30, label: '30', desc: 'Classical' },
]

export function TimeControlSelector({ current, onChange }: TimeControlSelectorProps) {
  return (
    <div className={styles.container} data-testid="time-control-selector">
      <span className={styles.label}>Time Control</span>
      <div className={styles.options}>
        {TIME_CONTROLS.map(({ value, label, desc }) => (
          <button
            key={value}
            className={`${styles.btn} ${current === value ? styles.active : ''}`}
            onClick={() => onChange(value)}
            title={desc}
            data-testid={`tc-${value}`}
          >
            {label}
            <span className={styles.desc}>{desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
