import { useState, useEffect, useRef, useCallback } from 'react'
import type { PieceColor } from '../types/chess'

export type TimeControl = 'unlimited' | 3 | 5 | 10 | 30

export interface TimerState {
  whiteTime: number   // seconds remaining
  blackTime: number   // seconds remaining
  activeColor: PieceColor | null
  isRunning: boolean
  timeControl: TimeControl
  whiteTimedOut: boolean
  blackTimedOut: boolean
}

function getInitialSeconds(timeControl: TimeControl): number {
  if (timeControl === 'unlimited') return Infinity
  return timeControl * 60
}

export function useGameTimer(
  currentTurn: PieceColor,
  gamePhase: string,
  onTimeout: (loser: PieceColor) => void
) {
  const [timeControl, setTimeControl] = useState<TimeControl>('unlimited')
  const [whiteTime, setWhiteTime] = useState<number>(Infinity)
  const [blackTime, setBlackTime] = useState<number>(Infinity)
  const [isRunning, setIsRunning] = useState(false)
  const [timedOut, setTimedOut] = useState<PieceColor | null>(null)

  const onTimeoutRef = useRef(onTimeout)
  onTimeoutRef.current = onTimeout

  // Start timer when first move made (game is live and not unlimited)
  const isGameLive = gamePhase === 'playing' || gamePhase === 'check'

  useEffect(() => {
    if (!isGameLive || timeControl === 'unlimited' || timedOut) {
      setIsRunning(false)
      return
    }
    setIsRunning(true)
  }, [isGameLive, timeControl, timedOut])

  // Countdown tick
  useEffect(() => {
    if (!isRunning || timeControl === 'unlimited') return

    const interval = setInterval(() => {
      if (currentTurn === 'w') {
        setWhiteTime((prev) => {
          const next = prev - 1
          if (next <= 0) {
            setTimedOut('w')
            onTimeoutRef.current('w')
            return 0
          }
          return next
        })
      } else {
        setBlackTime((prev) => {
          const next = prev - 1
          if (next <= 0) {
            setTimedOut('b')
            onTimeoutRef.current('b')
            return 0
          }
          return next
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, currentTurn, timeControl])

  const selectTimeControl = useCallback((tc: TimeControl) => {
    setTimeControl(tc)
    const secs = getInitialSeconds(tc)
    setWhiteTime(secs)
    setBlackTime(secs)
    setTimedOut(null)
    setIsRunning(false)
  }, [])

  const reset = useCallback((tc?: TimeControl) => {
    const newTc = tc ?? timeControl
    const secs = getInitialSeconds(newTc)
    setTimeControl(newTc)
    setWhiteTime(secs)
    setBlackTime(secs)
    setTimedOut(null)
    setIsRunning(false)
  }, [timeControl])

  return {
    timerState: {
      whiteTime,
      blackTime,
      activeColor: isGameLive ? currentTurn : null,
      isRunning,
      timeControl,
      whiteTimedOut: timedOut === 'w',
      blackTimedOut: timedOut === 'b',
    } as TimerState,
    selectTimeControl,
    resetTimer: reset,
  }
}

export function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '∞'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
