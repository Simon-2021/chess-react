import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CapturedPieces } from '../components/CapturedPieces/CapturedPieces'
import { Chess } from 'chess.js'

describe('CapturedPieces', () => {
  it('renders with no captures', () => {
    render(<CapturedPieces moves={[]} />)
    expect(screen.getByTestId('captured-pieces')).toBeInTheDocument()
    expect(screen.getAllByText('—')).toHaveLength(2)
  })

  it('shows captured pieces after a capture', () => {
    const chess = new Chess()
    chess.move('e4')
    chess.move('d5')
    chess.move('exd5')
    const moves = chess.history({ verbose: true })
    render(<CapturedPieces moves={moves} />)
    // White captured a pawn from black
    expect(screen.getByTestId('white-captures')).not.toHaveTextContent('—')
  })

  it('renders the component title', () => {
    render(<CapturedPieces moves={[]} />)
    expect(screen.getByText(/captured pieces/i)).toBeInTheDocument()
  })
})
