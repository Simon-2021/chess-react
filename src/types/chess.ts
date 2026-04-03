import type { Move, Square } from 'chess.js'

/** 游戏阶段 */
export type GamePhase =
  | 'playing'
  | 'check'
  | 'checkmate'
  | 'stalemate'
  | 'draw'

/** 棋子颜色 */
export type PieceColor = 'w' | 'b'

/** 棋子类型 */
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'

/** 升变棋子类型 */
export type PromotionPiece = 'q' | 'r' | 'b' | 'n'

/** 游戏状态 */
export interface GameState {
  fen: string
  turn: PieceColor
  phase: GamePhase
  moveHistory: Move[]
  capturedPieces: {
    w: PieceType[]
    b: PieceType[]
  }
  selectedSquare: Square | null
  legalMoves: Square[]
  lastMove: {
    from: Square
    to: Square
  } | null
  promotionPending: {
    from: Square
    to: Square
    color: PieceColor
  } | null
  winner: PieceColor | null
  boardFlipped: boolean
  elapsedSeconds: number
  /** 历史回放：当前查看的走法索引（-1 = 最新局面） */
  viewingMoveIndex: number
  /** 历史回放模式下的 FEN */
  viewingFen: string | null
}

/** 走法历史显示用 */
export interface MoveHistoryEntry {
  moveNumber: number
  white?: string
  black?: string
}

/** 被吃子统计 */
export interface CapturedPiecesInfo {
  whiteCaptured: { piece: PieceType; count: number }[]
  blackCaptured: { piece: PieceType; count: number }[]
  materialDiff: number
}

/** 棋子价值 */
export const PIECE_VALUES: Record<PieceType, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
}
