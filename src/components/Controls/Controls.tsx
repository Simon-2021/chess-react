import styles from './Controls.module.css'

interface ControlsProps {
  onNewGame: () => void
  onUndo: () => void
  onFlipBoard: () => void
  canUndo: boolean
}

export function Controls({ onNewGame, onUndo, onFlipBoard, canUndo }: ControlsProps) {
  return (
    <div className={styles.container} data-testid="controls">
      <button
        className={`${styles.btn} ${styles.primary}`}
        onClick={onNewGame}
        data-testid="new-game-btn"
      >
        🔄 New Game
      </button>
      <button
        className={`${styles.btn} ${styles.secondary}`}
        onClick={onUndo}
        disabled={!canUndo}
        data-testid="undo-btn"
      >
        ↩ Undo
      </button>
      <button
        className={`${styles.btn} ${styles.secondary}`}
        onClick={onFlipBoard}
        data-testid="flip-btn"
      >
        ⟲ Flip
      </button>
    </div>
  )
}
