import { Chess } from 'chess.js'
import type { PieceType, CapturedPiecesInfo, MoveHistoryEntry, GamePhase, PieceColor } from '../types/chess'
import { PIECE_VALUES } from '../types/chess'
import type { Move } from 'chess.js'

/**
 * Determine game phase from chess instance
 */
export function getGamePhase(chess: Chess): GamePhase {
  if (chess.isCheckmate()) return 'checkmate'
  if (chess.isStalemate()) return 'stalemate'
  if (chess.isDraw()) return 'draw'
  if (chess.isCheck()) return 'check'
  return 'playing'
}

/**
 * Calculate captured pieces from move history
 */
export function calculateCapturedPieces(moves: Move[]): {
  w: PieceType[]
  b: PieceType[]
} {
  const captured: { w: PieceType[]; b: PieceType[] } = { w: [], b: [] }

  for (const move of moves) {
    if (move.captured) {
      // When white captures, the captured piece was black's (b)
      // But we track it as "captured FROM black's side"
      if (move.color === 'w') {
        captured.b.push(move.captured as PieceType)
      } else {
        captured.w.push(move.captured as PieceType)
      }
    }
  }

  return captured
}

/**
 * Calculate material difference (positive = white advantage)
 */
export function calculateMaterialDiff(capturedPieces: { w: PieceType[]; b: PieceType[] }): number {
  const blackLost = capturedPieces.b.reduce((sum, p) => sum + PIECE_VALUES[p], 0)
  const whiteLost = capturedPieces.w.reduce((sum, p) => sum + PIECE_VALUES[p], 0)
  return blackLost - whiteLost
}

/**
 * Get captured pieces info for display
 */
export function getCapturedPiecesInfo(moves: Move[]): CapturedPiecesInfo {
  const captured = calculateCapturedPieces(moves)

  const countPieces = (pieces: PieceType[]) => {
    const counts = new Map<PieceType, number>()
    for (const p of pieces) {
      counts.set(p, (counts.get(p) || 0) + 1)
    }
    return Array.from(counts.entries()).map(([piece, count]) => ({ piece, count }))
  }

  return {
    whiteCaptured: countPieces(captured.b), // pieces white captured (were black's)
    blackCaptured: countPieces(captured.w), // pieces black captured (were white's)
    materialDiff: calculateMaterialDiff(captured),
  }
}

/**
 * Convert move history to display entries
 */
export function getMoveHistoryEntries(moves: Move[]): MoveHistoryEntry[] {
  const entries: MoveHistoryEntry[] = []

  for (let i = 0; i < moves.length; i++) {
    const moveNumber = Math.floor(i / 2) + 1
    if (i % 2 === 0) {
      entries.push({
        moveNumber,
        white: moves[i].san,
        black: undefined,
      })
    } else {
      if (entries.length > 0) {
        entries[entries.length - 1].black = moves[i].san
      }
    }
  }

  return entries
}

/**
 * Get winner from chess instance
 */
export function getWinner(chess: Chess): PieceColor | null {
  if (!chess.isCheckmate()) return null
  // The current turn is the loser (they have no legal moves)
  return chess.turn() === 'w' ? 'b' : 'w'
}

/**
 * Format piece symbol for display
 */
export const PIECE_SYMBOLS: Record<string, string> = {
  wp: '♙',
  wn: '♘',
  wb: '♗',
  wr: '♖',
  wq: '♕',
  wk: '♔',
  bp: '♟',
  bn: '♞',
  bb: '♝',
  br: '♜',
  bq: '♛',
  bk: '♚',
}

export function getPieceSymbol(color: string, type: string): string {
  return PIECE_SYMBOLS[`${color}${type}`] || '?'
}

/**
 * Find the king's square for a given color from FEN
 */
export function findKingSquare(fen: string, color: PieceColor): string | null {
  const chess = new Chess(fen)
  const board = chess.board()
  for (const row of board) {
    for (const cell of row) {
      if (cell && cell.type === 'k' && cell.color === color) {
        return cell.square
      }
    }
  }
  return null
}
