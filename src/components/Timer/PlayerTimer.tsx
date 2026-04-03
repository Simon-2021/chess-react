import { memo } from 'react'
import type { PieceColor } from '../../types/chess'
import { formatTime } from '../../hooks/useGameTimer'
import styles from './PlayerTimer.module.css'

interface PlayerTimerProps {
  color: PieceColor
  timeSeconds: number
  isActive: boolean
  isTimedOut: boolean
}

export const PlayerTimer = memo(function PlayerTimer({ color, timeSeconds, isActive, isTimedOut }: PlayerTimerProps) {
  const isLow = isFinite(timeSeconds) && timeSeconds < 30
  const displayName = color === 'w' ? 'White' : 'Black'

  return (
    <div
      className={`${styles.timer} ${isActive ? styles.active : ''} ${isLow ? styles.low : ''} ${isTimedOut ? styles.timedOut : ''}`}
      data-testid={`timer-${color}`}
      aria-label={`${displayName} player timer: ${formatTime(timeSeconds)}`}
    >
      <span className={styles.colorDot} />
      <span className={styles.name}>{displayName}</span>
      <span className={styles.time} data-testid={`time-${color}`} aria-live="off">
        {isTimedOut ? '0:00' : formatTime(timeSeconds)}
      </span>
    </div>
  )
})
