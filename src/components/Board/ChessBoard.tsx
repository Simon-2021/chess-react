import { Chessboard } from 'react-chessboard'
import type { ChessboardOptions } from 'react-chessboard'
import { Chess } from 'chess.js'
import type { Square } from 'chess.js'
import type { GameState } from '../../types/chess'
import styles from './ChessBoard.module.css'

interface ChessBoardProps {
  state: GameState
  onSquareClick: (square: Square) => void
  onPieceDrop: (from: string, to: string) => boolean
  darkSquare?: string
  lightSquare?: string
}

/** Find the current turn's king square when in check/checkmate */
function findKingInCheckSquare(fen: string): string | null {
  const chess = new Chess(fen)
  if (!chess.isCheck() && !chess.isCheckmate()) return null
  
  const turn = chess.turn()
  const board = chess.board()
  for (const row of board) {
    for (const cell of row) {
      if (cell && cell.type === 'k' && cell.color === turn) {
        return cell.square
      }
    }
  }
  return null
}

/** Check if a target square has an opponent piece */
function isCapturableSquare(fen: string, square: string): boolean {
  const chess = new Chess(fen)
  const piece = chess.get(square as Square)
  return piece !== null && piece !== undefined && piece.color !== chess.turn()
}

export function ChessBoard({ state, onSquareClick, onPieceDrop, darkSquare = '#b58863', lightSquare = '#f0d9b5' }: ChessBoardProps) {
  const { fen, selectedSquare, legalMoves, lastMove, boardFlipped, phase } = state

  // Build custom square styles
  const squareStyles: Record<string, React.CSSProperties> = {}

  // Highlight last move
  if (lastMove) {
    squareStyles[lastMove.from] = {
      backgroundColor: 'rgba(155, 199, 0, 0.41)',
    }
    squareStyles[lastMove.to] = {
      backgroundColor: 'rgba(155, 199, 0, 0.41)',
    }
  }

  // Highlight selected square
  if (selectedSquare) {
    squareStyles[selectedSquare] = {
      backgroundColor: 'rgba(255, 255, 0, 0.4)',
    }
  }

  // Highlight legal moves - distinguish empty vs capturable
  for (const sq of legalMoves) {
    if (isCapturableSquare(fen, sq)) {
      // Capturable target - ring highlight
      squareStyles[sq] = {
        background: 'radial-gradient(transparent 60%, rgba(20,85,0,.3) 60%)',
      }
    } else {
      // Empty target - dot
      squareStyles[sq] = {
        background: 'radial-gradient(circle, rgba(0,0,0,.2) 26%, transparent 26%)',
      }
    }
  }

  // Highlight king in check/checkmate with red
  if (phase === 'check' || phase === 'checkmate') {
    const kingSquare = findKingInCheckSquare(fen)
    if (kingSquare) {
      squareStyles[kingSquare] = {
        ...squareStyles[kingSquare],
        backgroundColor: 'rgba(255, 0, 0, 0.4)',
        boxShadow: 'inset 0 0 0 3px rgba(255, 0, 0, 0.8)',
      }
    }
  }

  const options: ChessboardOptions = {
    position: fen,
    boardOrientation: boardFlipped ? 'black' : 'white',
    squareStyles,
    boardStyle: {
      borderRadius: '8px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
    },
    darkSquareStyle: { backgroundColor: darkSquare },
    lightSquareStyle: { backgroundColor: lightSquare },
    onSquareClick: ({ square }) => onSquareClick(square as Square),
    onPieceDrop: ({ sourceSquare, targetSquare }) => {
      if (!targetSquare) return false
      return onPieceDrop(sourceSquare, targetSquare)
    },
  }

  return (
    <div className={styles.boardContainer} data-testid="chess-board">
      <Chessboard options={options} />
    </div>
  )
}
