import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameStatus } from '../components/GameStatus/GameStatus'
import type { GameState } from '../types/chess'

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    turn: 'w',
    phase: 'playing',
    moveHistory: [],
    capturedPieces: { w: [], b: [] },
    selectedSquare: null,
    legalMoves: [],
    lastMove: null,
    promotionPending: null,
    winner: null,
    boardFlipped: false,
    viewingMoveIndex: -1,
    viewingFen: null,
    elapsedSeconds: 0,
    ...overrides,
  }
}

describe('GameStatus', () => {
  it('renders white to move', () => {
    render(<GameStatus state={makeState({ turn: 'w' })} />)
    expect(screen.getByText(/white to move/i)).toBeInTheDocument()
  })

  it('renders black to move', () => {
    render(<GameStatus state={makeState({ turn: 'b' })} />)
    expect(screen.getByText(/black to move/i)).toBeInTheDocument()
  })

  it('shows check warning', () => {
    render(<GameStatus state={makeState({ phase: 'check', turn: 'w' })} />)
    expect(screen.getByTestId('status-message')).toHaveTextContent(/check/i)
  })

  it('shows checkmate message with winner', () => {
    render(<GameStatus state={makeState({ phase: 'checkmate', winner: 'b' })} />)
    expect(screen.getByTestId('status-message')).toHaveTextContent(/black wins/i)
  })

  it('shows stalemate message', () => {
    render(<GameStatus state={makeState({ phase: 'stalemate' })} />)
    expect(screen.getByTestId('status-message')).toHaveTextContent(/stalemate/i)
  })

  it('renders timer', () => {
    render(<GameStatus state={makeState({ elapsedSeconds: 65 })} />)
    expect(screen.getByTestId('game-timer')).toHaveTextContent('1:05')
  })

  it('renders 0:00 at game start', () => {
    render(<GameStatus state={makeState()} />)
    expect(screen.getByTestId('game-timer')).toHaveTextContent('0:00')
  })
})
