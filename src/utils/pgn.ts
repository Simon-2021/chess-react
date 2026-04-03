import { Chess } from 'chess.js'
import type { Move } from 'chess.js'

/**
 * Generate PGN string from move history
 */
export function generatePGN(moves: Move[], result: string = '*'): string {
  const chess = new Chess()
  
  // Replay moves to rebuild PGN
  for (const move of moves) {
    try {
      chess.move({ from: move.from, to: move.to, promotion: move.promotion })
    } catch {
      break
    }
  }
  
  // Set result header
  const pgn = chess.pgn({
    maxWidth: 72,
  })
  
  if (!pgn) {
    // Build manually if pgn() returns empty
    const now = new Date()
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
    const headers = [
      `[Event "Casual Game"]`,
      `[Site "Chess React"]`,
      `[Date "${dateStr}"]`,
      `[White "White"]`,
      `[Black "Black"]`,
      `[Result "${result}"]`,
      '',
    ].join('\n')
    
    const moveParts: string[] = []
    for (let i = 0; i < moves.length; i++) {
      if (i % 2 === 0) moveParts.push(`${Math.floor(i / 2) + 1}.`)
      moveParts.push(moves[i].san)
    }
    moveParts.push(result)
    
    return headers + moveParts.join(' ')
  }
  
  return pgn
}

/**
 * Import PGN and return the chess instance
 */
export function importPGN(pgnText: string): { chess: Chess; error: string | null } {
  const chess = new Chess()
  try {
    chess.loadPgn(pgnText.trim())
    return { chess, error: null }
  } catch (e) {
    return { chess: new Chess(), error: `Invalid PGN: ${e instanceof Error ? e.message : 'Unknown error'}` }
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  }
}

/**
 * Download PGN as file
 */
export function downloadPGN(pgn: string, filename = 'game.pgn') {
  const blob = new Blob([pgn], { type: 'application/x-chess-pgn' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
