import { Chess } from 'chess.js'
import type { Move } from 'chess.js'

export type AIDifficulty = 'easy' | 'medium'

/** Piece values for static evaluation */
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
}

/** Position bonus tables (white perspective, ranks 1-8) */
const PAWN_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
]

const KNIGHT_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
]

/**
 * Static evaluation of position (positive = white advantage)
 */
function evaluate(chess: Chess): number {
  let score = 0
  const board = chess.board()

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file]
      if (!piece) continue

      const value = PIECE_VALUES[piece.type] ?? 0
      let posBonus = 0

      if (piece.type === 'p') {
        posBonus = piece.color === 'w' 
          ? PAWN_TABLE[7 - rank][file] 
          : PAWN_TABLE[rank][file]
      } else if (piece.type === 'n') {
        posBonus = KNIGHT_TABLE[rank][file]
      }

      if (piece.color === 'w') {
        score += value + posBonus
      } else {
        score -= value + posBonus
      }
    }
  }

  return score
}

/**
 * Minimax with alpha-beta pruning
 */
function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || chess.isGameOver()) {
    if (chess.isCheckmate()) {
      return isMaximizing ? -100000 : 100000
    }
    return evaluate(chess)
  }

  const moves = chess.moves({ verbose: true })

  if (isMaximizing) {
    let maxScore = -Infinity
    for (const move of moves) {
      chess.move(move)
      const score = minimax(chess, depth - 1, alpha, beta, false)
      chess.undo()
      maxScore = Math.max(maxScore, score)
      alpha = Math.max(alpha, score)
      if (beta <= alpha) break
    }
    return maxScore
  } else {
    let minScore = Infinity
    for (const move of moves) {
      chess.move(move)
      const score = minimax(chess, depth - 1, alpha, beta, true)
      chess.undo()
      minScore = Math.min(minScore, score)
      beta = Math.min(beta, score)
      if (beta <= alpha) break
    }
    return minScore
  }
}

/**
 * Get best move for current position
 */
export function getBestMove(chess: Chess, difficulty: AIDifficulty): Move | null {
  const moves = chess.moves({ verbose: true })
  if (moves.length === 0) return null

  if (difficulty === 'easy') {
    // Random move
    return moves[Math.floor(Math.random() * moves.length)]
  }

  // Medium: Minimax depth 2
  const isWhite = chess.turn() === 'w'
  let bestMove: Move | null = null
  let bestScore = isWhite ? -Infinity : Infinity

  // Shuffle to add variety
  const shuffled = [...moves].sort(() => Math.random() - 0.5)

  for (const move of shuffled) {
    chess.move(move)
    const score = minimax(chess, 2, -Infinity, Infinity, !isWhite)
    chess.undo()

    if (isWhite ? score > bestScore : score < bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}
