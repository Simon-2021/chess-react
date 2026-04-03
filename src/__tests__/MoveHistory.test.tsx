import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MoveHistory } from '../components/MoveHistory/MoveHistory'
import { Chess } from 'chess.js'

const defaultProps = {
  viewingMoveIndex: -1,
  onMoveClick: vi.fn(),
  onReturnToPresent: vi.fn(),
  isViewingHistory: false,
}

describe('MoveHistory', () => {
  it('renders empty state', () => {
    render(<MoveHistory moves={[]} {...defaultProps} />)
    expect(screen.getByText(/no moves yet/i)).toBeInTheDocument()
  })

  it('renders moves in algebraic notation', () => {
    const chess = new Chess()
    chess.move('e4')
    chess.move('e5')
    const moves = chess.history({ verbose: true })
    render(<MoveHistory moves={moves} {...defaultProps} />)
    expect(screen.getByText('e4')).toBeInTheDocument()
    expect(screen.getByText('e5')).toBeInTheDocument()
  })

  it('renders move numbers', () => {
    const chess = new Chess()
    chess.move('e4')
    chess.move('e5')
    const moves = chess.history({ verbose: true })
    render(<MoveHistory moves={moves} {...defaultProps} />)
    expect(screen.getByText('1.')).toBeInTheDocument()
  })

  it('renders multiple moves', () => {
    const chess = new Chess()
    chess.move('e4')
    chess.move('e5')
    chess.move('Nf3')
    chess.move('Nc6')
    const moves = chess.history({ verbose: true })
    render(<MoveHistory moves={moves} {...defaultProps} />)
    expect(screen.getByText('Nf3')).toBeInTheDocument()
    expect(screen.getByText('Nc6')).toBeInTheDocument()
    expect(screen.getByText('2.')).toBeInTheDocument()
  })

  it('calls onMoveClick when a move is clicked', () => {
    const onMoveClick = vi.fn()
    const chess = new Chess()
    chess.move('e4')
    chess.move('e5')
    const moves = chess.history({ verbose: true })
    render(<MoveHistory moves={moves} {...defaultProps} onMoveClick={onMoveClick} />)
    fireEvent.click(screen.getByText('e4'))
    expect(onMoveClick).toHaveBeenCalledWith(0)
  })

  it('shows return button when viewing history', () => {
    render(
      <MoveHistory
        moves={[]}
        viewingMoveIndex={0}
        onMoveClick={vi.fn()}
        onReturnToPresent={vi.fn()}
        isViewingHistory={true}
      />
    )
    expect(screen.getByTestId('return-to-present')).toBeInTheDocument()
  })

  it('highlights the active move', () => {
    const chess = new Chess()
    chess.move('e4')
    chess.move('e5')
    const moves = chess.history({ verbose: true })
    render(<MoveHistory moves={moves} {...defaultProps} viewingMoveIndex={0} isViewingHistory={true} />)
    const activeMove = screen.getByTestId('move-0')
    expect(activeMove.className).toMatch(/active/)
  })
})
