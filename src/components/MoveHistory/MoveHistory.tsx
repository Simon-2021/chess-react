import { useEffect, useRef } from 'react'
import type { MoveHistoryEntry } from '../../types/chess'
import { getMoveHistoryEntries } from '../../utils/chess'
import type { Move } from 'chess.js'
import styles from './MoveHistory.module.css'

interface MoveHistoryProps {
  moves: Move[]
  viewingMoveIndex: number
  onMoveClick: (moveIndex: number) => void
  onReturnToPresent: () => void
  isViewingHistory: boolean
}

export function MoveHistory({ moves, viewingMoveIndex, onMoveClick, onReturnToPresent, isViewingHistory }: MoveHistoryProps) {
  const entries: MoveHistoryEntry[] = getMoveHistoryEntries(moves)
  const bottomRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLSpanElement>(null)

  // Auto-scroll to bottom when not viewing history
  useEffect(() => {
    if (!isViewingHistory && bottomRef.current?.scrollIntoView) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [moves.length, isViewingHistory])

  // Scroll active move into view when navigating history
  useEffect(() => {
    if (isViewingHistory && activeRef.current?.scrollIntoView) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [viewingMoveIndex, isViewingHistory])

  return (
    <div className={styles.container} data-testid="move-history">
      <div className={styles.header}>
        <h3 className={styles.title}>Move History</h3>
        {isViewingHistory && (
          <button className={styles.returnBtn} onClick={onReturnToPresent} data-testid="return-to-present">
            ↩ Return
          </button>
        )}
      </div>
      <div className={styles.list} role="list">
        {entries.length === 0 ? (
          <div className={styles.empty}>No moves yet</div>
        ) : (
          entries.map((entry) => {
            const whiteMoveIndex = (entry.moveNumber - 1) * 2
            const blackMoveIndex = whiteMoveIndex + 1
            const isWhiteActive = viewingMoveIndex === whiteMoveIndex
            const isBlackActive = viewingMoveIndex === blackMoveIndex

            return (
              <div key={entry.moveNumber} className={styles.row} role="listitem">
                <span className={styles.moveNum}>{entry.moveNumber}.</span>
                <span
                  className={`${styles.move} ${styles.white} ${isWhiteActive ? styles.active : ''}`}
                  onClick={() => onMoveClick(whiteMoveIndex)}
                  data-testid={`move-${whiteMoveIndex}`}
                  ref={isWhiteActive ? activeRef : null}
                >
                  {entry.white ?? ''}
                </span>
                <span
                  className={`${styles.move} ${styles.black} ${isBlackActive ? styles.active : ''} ${!entry.black ? styles.empty : ''}`}
                  onClick={() => entry.black && onMoveClick(blackMoveIndex)}
                  data-testid={`move-${blackMoveIndex}`}
                  ref={isBlackActive ? activeRef : null}
                >
                  {entry.black ?? ''}
                </span>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
