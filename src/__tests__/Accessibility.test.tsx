import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { Controls } from '../components/Controls/Controls'
import { PromotionDialog } from '../components/PromotionDialog/PromotionDialog'
import { Collapsible } from '../components/Collapsible/Collapsible'
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
    elapsedSeconds: 0,
    viewingMoveIndex: -1,
    viewingFen: null,
    ...overrides,
  }
}

describe('Accessibility - Controls', () => {
  it('all buttons have accessible text', () => {
    render(<Controls onNewGame={vi.fn()} onUndo={vi.fn()} onFlipBoard={vi.fn()} canUndo={true} />)
    // Each button should have text content
    const buttons = screen.getAllByRole('button')
    for (const btn of buttons) {
      expect(btn.textContent?.trim().length).toBeGreaterThan(0)
    }
  })

  it('disabled undo button is properly disabled', () => {
    render(<Controls onNewGame={vi.fn()} onUndo={vi.fn()} onFlipBoard={vi.fn()} canUndo={false} />)
    expect(screen.getByTestId('undo-btn')).toBeDisabled()
  })
})

describe('Accessibility - PromotionDialog', () => {
  it('has role="dialog"', () => {
    render(<PromotionDialog color="w" onSelect={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('dialog has aria-label', () => {
    render(<PromotionDialog color="w" onSelect={vi.fn()} onCancel={vi.fn()} />)
    const dialog = screen.getByTestId('promotion-dialog')
    expect(dialog).toHaveAttribute('aria-label', 'Pawn Promotion')
  })

  it('promotion buttons have aria-labels', () => {
    render(<PromotionDialog color="w" onSelect={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByLabelText('Queen')).toBeInTheDocument()
    expect(screen.getByLabelText('Rook')).toBeInTheDocument()
    expect(screen.getByLabelText('Bishop')).toBeInTheDocument()
    expect(screen.getByLabelText('Knight')).toBeInTheDocument()
  })
})

describe('Accessibility - Collapsible', () => {
  it('toggle button has aria-expanded', () => {
    render(<Collapsible title="Test" defaultOpen={false}><div>content</div></Collapsible>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  it('aria-expanded updates on toggle', async () => {
    const { getByRole } = render(
      <Collapsible title="Test" defaultOpen={false}><div>content</div></Collapsible>
    )
    const btn = getByRole('button')
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    act(() => { btn.click() })
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })
})

describe('Accessibility - GameStatus', () => {
  it('renders status container', () => {
    render(<GameStatus state={makeState()} />)
    expect(screen.getByTestId('game-status')).toBeInTheDocument()
  })

  it('timer has test id', () => {
    render(<GameStatus state={makeState()} />)
    expect(screen.getByTestId('game-timer')).toBeInTheDocument()
  })
})
