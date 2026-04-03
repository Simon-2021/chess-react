import { describe, it, expect } from 'vitest'
import { generatePGN, importPGN } from '../utils/pgn'
import { Chess } from 'chess.js'

describe('generatePGN', () => {
  it('generates PGN for empty game', () => {
    const pgn = generatePGN([])
    expect(pgn).toBeDefined()
  })

  it('generates PGN with moves', () => {
    const chess = new Chess()
    chess.move('e4')
    chess.move('e5')
    chess.move('Nf3')
    const moves = chess.history({ verbose: true })
    const pgn = generatePGN(moves)
    expect(pgn).toContain('e4')
    expect(pgn).toContain('e5')
    expect(pgn).toContain('Nf3')
  })

  it('generates PGN without errors for empty game', () => {
    const pgn = generatePGN([], '1-0')
    expect(typeof pgn).toBe('string')
    expect(pgn.length).toBeGreaterThan(0)
  })
})

describe('importPGN', () => {
  it('imports valid PGN', () => {
    const pgnText = `[Event "Test"]
[White "Player1"]
[Black "Player2"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 1-0`
    const { chess, error } = importPGN(pgnText)
    expect(error).toBeNull()
    expect(chess.history().length).toBe(5)
  })

  it('returns error for invalid PGN', () => {
    const { error } = importPGN('this is not pgn!!! xyz xyz')
    expect(error).not.toBeNull()
  })

  it('imports Italian opening', () => {
    const pgnText = '1. e4 e5 2. Nf3 Nc6 3. Bc4'
    const { chess, error } = importPGN(pgnText)
    expect(error).toBeNull()
    expect(chess.history()).toContain('Bc4')
  })
})
