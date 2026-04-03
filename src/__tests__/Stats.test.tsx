import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StatsPanel } from '../components/Stats/StatsPanel'
import { calcMoveStats } from '../hooks/useGameStats'
import { Chess } from 'chess.js'

const defaultMoveStats = { totalMoves: 0, captures: 0, checks: 0, longestNonCapture: 0 }
const defaultSessionStats = { gamesPlayed: 0, whiteWins: 0, blackWins: 0, draws: 0 }

describe('calcMoveStats', () => {
  it('returns zeros for empty moves', () => {
    expect(calcMoveStats([])).toEqual({
      totalMoves: 0, captures: 0, checks: 0, longestNonCapture: 0,
    })
  })

  it('counts total moves correctly', () => {
    const chess = new Chess()
    chess.move('e4')
    chess.move('e5')
    chess.move('Nf3')
    const moves = chess.history({ verbose: true })
    const stats = calcMoveStats(moves)
    expect(stats.totalMoves).toBe(3)
  })

  it('counts captures', () => {
    const chess = new Chess()
    chess.move('e4')
    chess.move('d5')
    chess.move('exd5') // capture
    const moves = chess.history({ verbose: true })
    const stats = calcMoveStats(moves)
    expect(stats.captures).toBe(1)
  })

  it('counts checks', () => {
    const chess = new Chess()
    chess.move('e4')
    chess.move('d5')
    chess.move('Bb5') // check
    const moves = chess.history({ verbose: true })
    const stats = calcMoveStats(moves)
    expect(stats.checks).toBe(1)
  })

  it('calculates longest non-capture sequence', () => {
    const chess = new Chess()
    chess.move('e4')  // non-capture
    chess.move('e5')  // non-capture
    chess.move('d4')  // non-capture
    chess.move('d5')  // non-capture
    chess.move('exd5') // capture - resets sequence
    const moves = chess.history({ verbose: true })
    const stats = calcMoveStats(moves)
    expect(stats.longestNonCapture).toBe(4) // e4, e5, d4, d5
  })
})

describe('StatsPanel', () => {
  it('renders with zero stats', () => {
    render(
      <StatsPanel
        sessionStats={defaultSessionStats}
        moveStats={defaultMoveStats}
        onResetStats={vi.fn()}
      />
    )
    expect(screen.getByTestId('stats-panel')).toBeInTheDocument()
    expect(screen.getByTestId('white-wins')).toHaveTextContent('0')
    expect(screen.getByTestId('black-wins')).toHaveTextContent('0')
  })

  it('shows session results', () => {
    render(
      <StatsPanel
        sessionStats={{ gamesPlayed: 5, whiteWins: 3, blackWins: 1, draws: 1 }}
        moveStats={defaultMoveStats}
        onResetStats={vi.fn()}
      />
    )
    expect(screen.getByTestId('white-wins')).toHaveTextContent('3')
    expect(screen.getByTestId('black-wins')).toHaveTextContent('1')
    expect(screen.getByTestId('draws')).toHaveTextContent('1')
  })

  it('shows move stats', () => {
    render(
      <StatsPanel
        sessionStats={defaultSessionStats}
        moveStats={{ totalMoves: 20, captures: 5, checks: 2, longestNonCapture: 8 }}
        onResetStats={vi.fn()}
      />
    )
    expect(screen.getByTestId('move-stats')).toHaveTextContent('20')
    expect(screen.getByTestId('move-stats')).toHaveTextContent('5')
  })

  it('calls onResetStats when reset button clicked', () => {
    const onReset = vi.fn()
    render(
      <StatsPanel
        sessionStats={{ gamesPlayed: 3, whiteWins: 2, blackWins: 1, draws: 0 }}
        moveStats={defaultMoveStats}
        onResetStats={onReset}
      />
    )
    fireEvent.click(screen.getByTitle('Reset stats'))
    expect(onReset).toHaveBeenCalledOnce()
  })
})
