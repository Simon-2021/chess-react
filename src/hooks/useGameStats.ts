import { useState, useCallback, useEffect } from 'react'
import type { Move } from 'chess.js'
import type { GamePhase, PieceColor } from '../types/chess'

export interface SessionRecord {
  winner: PieceColor | 'draw'
  moveCount: number
  date: string
}

export interface SessionStats {
  gamesPlayed: number
  whiteWins: number
  blackWins: number
  draws: number
}

export interface MoveStats {
  totalMoves: number
  captures: number
  checks: number
  longestNonCapture: number
}

const STORAGE_KEY = 'chess-react-session-stats'

function loadStats(): SessionStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return { gamesPlayed: 0, whiteWins: 0, blackWins: 0, draws: 0 }
}

function saveStats(stats: SessionStats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // ignore
  }
}

export function useGameStats() {
  const [sessionStats, setSessionStats] = useState<SessionStats>(loadStats)

  // Persist on change
  useEffect(() => {
    saveStats(sessionStats)
  }, [sessionStats])

  const recordGameResult = useCallback((winner: PieceColor | null, phase: GamePhase) => {
    if (phase !== 'checkmate' && phase !== 'stalemate' && phase !== 'draw') return

    setSessionStats((prev) => {
      const next = { ...prev, gamesPlayed: prev.gamesPlayed + 1 }
      if (!winner || phase === 'stalemate' || phase === 'draw') {
        next.draws++
      } else if (winner === 'w') {
        next.whiteWins++
      } else {
        next.blackWins++
      }
      return next
    })
  }, [])

  const resetStats = useCallback(() => {
    const empty = { gamesPlayed: 0, whiteWins: 0, blackWins: 0, draws: 0 }
    setSessionStats(empty)
    saveStats(empty)
  }, [])

  return { sessionStats, recordGameResult, resetStats }
}

/**
 * Calculate move-level stats from move history
 */
export function calcMoveStats(moves: Move[]): MoveStats {
  let captures = 0
  let checks = 0
  let maxNonCapture = 0
  let currentNonCapture = 0

  for (const move of moves) {
    if (move.captured) {
      captures++
      currentNonCapture = 0
    } else {
      currentNonCapture++
      if (currentNonCapture > maxNonCapture) maxNonCapture = currentNonCapture
    }

    if (move.san.includes('+') || move.san.includes('#')) {
      checks++
    }
  }

  return {
    totalMoves: moves.length,
    captures,
    checks,
    longestNonCapture: maxNonCapture,
  }
}
