import { describe, it, expect } from 'vitest'
import { identifyOpening } from '../utils/openings'

describe('identifyOpening', () => {
  it('returns null for empty moves', () => {
    expect(identifyOpening([])).toBeNull()
  })

  it('identifies e4 as King\'s Pawn Opening', () => {
    const opening = identifyOpening(['e4'])
    expect(opening).not.toBeNull()
    expect(opening?.name).toContain("King's Pawn Opening")
  })

  it('identifies Ruy Lopez', () => {
    const opening = identifyOpening(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'])
    expect(opening?.name).toContain('Ruy Lopez')
  })

  it('identifies Italian Game', () => {
    const opening = identifyOpening(['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'])
    expect(opening?.name).toContain('Italian')
  })

  it('identifies Sicilian Defense', () => {
    const opening = identifyOpening(['e4', 'c5'])
    expect(opening?.name).toContain('Sicilian')
  })

  it('identifies French Defense', () => {
    const opening = identifyOpening(['e4', 'e6', 'd4', 'd5'])
    expect(opening?.name).toContain('French')
  })

  it('identifies Queen\'s Gambit', () => {
    const opening = identifyOpening(['d4', 'd5', 'c4'])
    expect(opening?.name).toContain("Queen's Gambit")
  })

  it('identifies English Opening', () => {
    const opening = identifyOpening(['c4'])
    expect(opening?.name).toContain('English')
  })

  it('returns longest matching opening', () => {
    // 'e4 e5 Nf3 Nc6 Bb5' should match Ruy Lopez not just King's Knight
    const opening = identifyOpening(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'])
    expect(opening?.moves.split(' ').length).toBeGreaterThanOrEqual(5)
  })

  it('returns null for unrecognized sequence', () => {
    // Very unusual opening unlikely to match
    const opening = identifyOpening(['a3', 'a6', 'h3', 'h6'])
    expect(opening).toBeNull()
  })
})
