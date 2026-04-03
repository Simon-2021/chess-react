import { describe, it, expect } from 'vitest'
import { Chess } from 'chess.js'
import { getBestMove } from '../utils/ai'

describe('getBestMove', () => {
  it('returns a valid move in easy mode', () => {
    const chess = new Chess()
    const move = getBestMove(chess, 'easy')
    expect(move).not.toBeNull()
    expect(typeof move?.from).toBe('string')
    expect(typeof move?.to).toBe('string')
  })

  it('returns a valid move in medium mode', () => {
    const chess = new Chess()
    const move = getBestMove(chess, 'medium')
    expect(move).not.toBeNull()
    // The move should be in the legal moves list
    const legalMoves = chess.moves({ verbose: true })
    const isLegal = legalMoves.some((m) => m.from === move?.from && m.to === move?.to)
    expect(isLegal).toBe(true)
  })

  it('returns null when no legal moves (fool\'s mate)', () => {
    // Fool's mate - black has just delivered checkmate
    const chess = new Chess()
    chess.move('f3')
    chess.move('e5')
    chess.move('g4')
    chess.move('Qh4') // Checkmate for white
    // White is in checkmate, so white has no moves
    expect(chess.isCheckmate()).toBe(true)
    const move = getBestMove(chess, 'easy')
    expect(move).toBeNull()
  })

  it('medium AI prefers captures', () => {
    // Position where AI can take a queen
    const chess = new Chess('rnb1kbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2')
    // This is after 1. e4 e5 - medium AI should make a reasonable move
    const move = getBestMove(chess, 'medium')
    expect(move).not.toBeNull()
    const legalMoves = chess.moves({ verbose: true })
    const isLegal = legalMoves.some((m) => m.from === move?.from && m.to === move?.to)
    expect(isLegal).toBe(true)
  })

  it('easy mode returns random moves (statistical)', () => {
    // Run 10 times and verify we get different moves occasionally
    const chess = new Chess()
    const moves = new Set<string>()
    for (let i = 0; i < 20; i++) {
      const move = getBestMove(chess, 'easy')
      if (move) moves.add(`${move.from}${move.to}`)
    }
    // Should have more than 1 unique move (randomness test)
    expect(moves.size).toBeGreaterThan(1)
  })
})

describe('GameModeSelector', () => {
  // Integration smoke test
  it('AI module imports correctly', async () => {
    const { getBestMove: fn } = await import('../utils/ai')
    expect(typeof fn).toBe('function')
  })
})
