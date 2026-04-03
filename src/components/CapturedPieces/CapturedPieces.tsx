import type { Move } from 'chess.js'
import { getCapturedPiecesInfo, getPieceSymbol } from '../../utils/chess'
import type { PieceType } from '../../types/chess'
import styles from './CapturedPieces.module.css'

interface CapturedPiecesProps {
  moves: Move[]
}

const PIECE_ORDER: PieceType[] = ['q', 'r', 'b', 'n', 'p']

export function CapturedPieces({ moves }: CapturedPiecesProps) {
  const info = getCapturedPiecesInfo(moves)
  const { whiteCaptured, blackCaptured, materialDiff } = info

  const renderCaptured = (pieces: { piece: PieceType; count: number }[], color: 'w' | 'b') => {
    const sorted = [...pieces].sort(
      (a, b) => PIECE_ORDER.indexOf(a.piece) - PIECE_ORDER.indexOf(b.piece)
    )
    return sorted.map(({ piece, count }) => (
      <span key={piece} className={styles.pieceGroup}>
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <span key={i} className={styles.piece}>
              {getPieceSymbol(color === 'w' ? 'b' : 'w', piece)}
            </span>
          ))}
      </span>
    ))
  }

  return (
    <div className={styles.container} data-testid="captured-pieces">
      <h3 className={styles.title}>Captured Pieces</h3>

      <div className={styles.row}>
        <span className={styles.label}>White:</span>
        <span className={styles.pieces} data-testid="white-captures">
          {whiteCaptured.length === 0 ? <span className={styles.none}>—</span> : renderCaptured(whiteCaptured, 'w')}
        </span>
        {materialDiff > 0 && <span className={styles.diff}>+{materialDiff}</span>}
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Black:</span>
        <span className={styles.pieces} data-testid="black-captures">
          {blackCaptured.length === 0 ? <span className={styles.none}>—</span> : renderCaptured(blackCaptured, 'b')}
        </span>
        {materialDiff < 0 && <span className={styles.diff}>+{Math.abs(materialDiff)}</span>}
      </div>
    </div>
  )
}
