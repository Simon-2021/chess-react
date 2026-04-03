import type { PromotionPiece, PieceColor } from '../../types/chess'
import { getPieceSymbol } from '../../utils/chess'
import styles from './PromotionDialog.module.css'

interface PromotionDialogProps {
  color: PieceColor
  onSelect: (piece: PromotionPiece) => void
  onCancel: () => void
}

const PROMOTION_PIECES: PromotionPiece[] = ['q', 'r', 'b', 'n']
const PIECE_NAMES: Record<PromotionPiece, string> = {
  q: 'Queen',
  r: 'Rook',
  b: 'Bishop',
  n: 'Knight',
}

export function PromotionDialog({ color, onSelect, onCancel }: PromotionDialogProps) {
  return (
    <div className={styles.overlay} role="dialog" aria-label="Pawn Promotion" data-testid="promotion-dialog">
      <div className={styles.modal}>
        <h3 className={styles.title}>Promote Pawn</h3>
        <p className={styles.subtitle}>Choose a piece for promotion</p>
        <div className={styles.options}>
          {PROMOTION_PIECES.map((piece) => (
            <button
              key={piece}
              className={styles.option}
              onClick={() => onSelect(piece)}
              aria-label={PIECE_NAMES[piece]}
              data-testid={`promote-${piece}`}
            >
              <span className={styles.pieceIcon}>{getPieceSymbol(color, piece)}</span>
              <span className={styles.pieceName}>{PIECE_NAMES[piece]}</span>
            </button>
          ))}
        </div>
        <button className={styles.cancel} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}
