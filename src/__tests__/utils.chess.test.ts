import { describe, it, expect } from 'vitest'
import { Chess } from 'chess.js'
import {
  getGamePhase,
  calculateCapturedPieces,
  calculateMaterialDiff,
  getCapturedPiecesInfo,
  getMoveHistoryEntries,
  getWinner,
} from '../utils/chess'

describe('getGamePhase', () => {
  it('returns playing for initial position', () => {
    const chess = new Chess()
    expect(getGamePhase(chess)).toBe('playing')
  })

  it('returns checkmate for checkmate position', () => {
    // Fool's mate
    const chess = new Chess()
    chess.move('f3')
    chess.move('e5')
    chess.move('g4')
    chess.move('Qh4')
    expect(getGamePhase(chess)).toBe('checkmate')
  })

  it('returns check when king is in check', () => {
    const chess = new Chess()
    // e4 d5 Bb5+ — bishop checks the black king
    chess.move('e4')
    chess.move('d5')
    chess.move('Bb5') // Check! Not checkmate — black can block or move king
    expect(getGamePhase(chess)).toBe('check')
  })

  it('returns stalemate for stalemate position', () => {
    // Classic stalemate FEN: black king on a8, white queen on c7, white king on b6
    // Black to move but has no legal moves and is NOT in check = stalemate
    const stalemateChess = new Chess('k7/2Q5/1K6/8/8/8/8/8 b - - 0 1')
    expect(getGamePhase(stalemateChess)).toBe('stalemate')
  })
})

describe('calculateCapturedPieces', () => {
  it('returns empty arrays for no captures', () => {
    const chess = new Chess()
    chess.move('e4')
    chess.move('e5')
    const history = chess.history({ verbose: true })
    const captured = calculateCapturedPieces(history)
    expect(captured.w).toHaveLength(0)
    expect(captured.b).toHaveLength(0)
  })

  it('tracks captured pawns correctly', () => {
    const chess = new Chess()
    chess.move('e4')
    chess.move('d5')
    chess.move('exd5') // white captures black pawn
    const history = chess.history({ verbose: true })
    const captured = calculateCapturedPieces(history)
    expect(captured.b).toContain('p') // black lost a pawn
    expect(captured.w).toHaveLength(0)
  })

  it('tracks when black captures white piece', () => {
    const chess = new Chess()
    chess.move('e4')
    chess.move('d5')
    chess.move('Nf3')
    chess.move('dxe4') // black captures white pawn
    const history = chess.history({ verbose: true })
    const captured = calculateCapturedPieces(history)
    expect(captured.w).toContain('p') // white lost a pawn
  })
})

describe('calculateMaterialDiff', () => {
  it('returns 0 when equal material', () => {
    const diff = calculateMaterialDiff({ w: ['p'], b: ['p'] })
    expect(diff).toBe(0)
  })

  it('returns positive when white is ahead', () => {
    const diff = calculateMaterialDiff({ w: [], b: ['q'] })
    expect(diff).toBe(9)
  })

  it('returns negative when black is ahead', () => {
    const diff = calculateMaterialDiff({ w: ['r'], b: [] })
    expect(diff).toBe(-5)
  })
})

describe('getMoveHistoryEntries', () => {
  it('returns empty array for no moves', () => {
    expect(getMoveHistoryEntries([])).toHaveLength(0)
  })

  it('creates entries with correct move numbers', () => {
    const chess = new Chess()
    chess.move('e4')
    chess.move('e5')
    chess.move('Nf3')
    const moves = chess.history({ verbose: true })
    const entries = getMoveHistoryEntries(moves)
    expect(entries).toHaveLength(2)
    expect(entries[0].moveNumber).toBe(1)
    expect(entries[0].white).toBe('e4')
    expect(entries[0].black).toBe('e5')
    expect(entries[1].moveNumber).toBe(2)
    expect(entries[1].white).toBe('Nf3')
    expect(entries[1].black).toBeUndefined()
  })
})

describe('getWinner', () => {
  it('returns null for ongoing game', () => {
    const chess = new Chess()
    expect(getWinner(chess)).toBeNull()
  })

  it('returns black when white is checkmated (fool\'s mate)', () => {
    const chess = new Chess()
    chess.move('f3')
    chess.move('e5')
    chess.move('g4')
    chess.move('Qh4')
    expect(getWinner(chess)).toBe('b')
  })
})

describe('getCapturedPiecesInfo', () => {
  it('calculates material diff correctly', () => {
    const chess = new Chess()
    chess.move('e4')
    chess.move('d5')
    chess.move('exd5')
    const moves = chess.history({ verbose: true })
    const info = getCapturedPiecesInfo(moves)
    expect(info.materialDiff).toBe(1) // white up 1 pawn
    expect(info.whiteCaptured).toHaveLength(1)
  })
})
