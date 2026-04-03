import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useChessGame } from '../hooks/useChessGame'

describe('useChessGame', () => {
  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useChessGame())
    expect(result.current.state.phase).toBe('playing')
    expect(result.current.state.turn).toBe('w')
    expect(result.current.state.moveHistory).toHaveLength(0)
    expect(result.current.state.winner).toBeNull()
  })

  it('initializes with white\'s FEN', () => {
    const { result } = renderHook(() => useChessGame())
    expect(result.current.state.fen).toContain('w')
  })

  it('selects a square when clicking own piece', () => {
    const { result } = renderHook(() => useChessGame())
    act(() => {
      result.current.selectSquare('e2')
    })
    expect(result.current.state.selectedSquare).toBe('e2')
    expect(result.current.state.legalMoves.length).toBeGreaterThan(0)
  })

  it('deselects when clicking empty square without piece', () => {
    const { result } = renderHook(() => useChessGame())
    act(() => {
      result.current.selectSquare('e2') // select white pawn
    })
    expect(result.current.state.selectedSquare).toBe('e2')
    act(() => {
      result.current.selectSquare('a3') // click empty invalid square
    })
    expect(result.current.state.selectedSquare).toBeNull()
  })

  it('makes a move by clicking source then target', () => {
    const { result } = renderHook(() => useChessGame())
    act(() => {
      result.current.selectSquare('e2')
    })
    act(() => {
      result.current.selectSquare('e4')
    })
    expect(result.current.state.moveHistory).toHaveLength(1)
    expect(result.current.state.moveHistory[0].san).toBe('e4')
    expect(result.current.state.turn).toBe('b')
  })

  it('resets the game', () => {
    const { result } = renderHook(() => useChessGame())
    act(() => { result.current.selectSquare('e2') })
    act(() => { result.current.selectSquare('e4') })
    expect(result.current.state.moveHistory).toHaveLength(1)
    act(() => {
      result.current.reset()
    })
    expect(result.current.state.moveHistory).toHaveLength(0)
    expect(result.current.state.turn).toBe('w')
  })

  it('undoes last move', () => {
    const { result } = renderHook(() => useChessGame())
    act(() => { result.current.selectSquare('e2') })
    act(() => { result.current.selectSquare('e4') })
    expect(result.current.state.moveHistory).toHaveLength(1)
    act(() => {
      result.current.undo()
    })
    expect(result.current.state.moveHistory).toHaveLength(0)
  })

  it('flips the board', () => {
    const { result } = renderHook(() => useChessGame())
    expect(result.current.state.boardFlipped).toBe(false)
    act(() => {
      result.current.flipBoard()
    })
    expect(result.current.state.boardFlipped).toBe(true)
    act(() => {
      result.current.flipBoard()
    })
    expect(result.current.state.boardFlipped).toBe(false)
  })

  it('onPieceDrop makes a move', () => {
    const { result } = renderHook(() => useChessGame())
    let success = false
    act(() => {
      success = result.current.onPieceDrop('e2', 'e4')
    })
    expect(success).toBe(true)
    expect(result.current.state.moveHistory).toHaveLength(1)
  })

  it('onPieceDrop rejects invalid move', () => {
    const { result } = renderHook(() => useChessGame())
    let success = true
    act(() => {
      success = result.current.onPieceDrop('e2', 'e6') // illegal jump
    })
    expect(success).toBe(false)
    expect(result.current.state.moveHistory).toHaveLength(0)
  })

  it('detects checkmate (fool\'s mate)', () => {
    const { result } = renderHook(() => useChessGame())
    act(() => {
      result.current.onPieceDrop('f2', 'f3')
    })
    act(() => {
      result.current.onPieceDrop('e7', 'e5')
    })
    act(() => {
      result.current.onPieceDrop('g2', 'g4')
    })
    act(() => {
      result.current.onPieceDrop('d8', 'h4') // Qh4#
    })
    expect(result.current.state.phase).toBe('checkmate')
    expect(result.current.state.winner).toBe('b')
  })

  it('viewMoveAt changes viewing FEN', () => {
    const { result } = renderHook(() => useChessGame())
    act(() => {
      result.current.onPieceDrop('e2', 'e4')
      result.current.onPieceDrop('e7', 'e5')
    })
    act(() => {
      result.current.viewMoveAt(0) // view after first move
    })
    expect(result.current.isViewingHistory).toBe(true)
    expect(result.current.state.viewingMoveIndex).toBe(0)
  })

  it('returnToPresent clears viewing history', () => {
    const { result } = renderHook(() => useChessGame())
    act(() => {
      result.current.onPieceDrop('e2', 'e4')
    })
    act(() => {
      result.current.viewMoveAt(0)
    })
    act(() => {
      result.current.returnToPresent()
    })
    expect(result.current.isViewingHistory).toBe(false)
    expect(result.current.state.viewingMoveIndex).toBe(-1)
  })
})
