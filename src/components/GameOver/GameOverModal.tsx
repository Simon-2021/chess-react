import { memo } from 'react'
import type { GamePhase, PieceColor } from '../../types/chess'
import styles from './GameOverModal.module.css'

interface GameOverModalProps {
  phase: GamePhase
  winner: PieceColor | null
  onNewGame: () => void
  onReview: () => void
}

function getTitle(phase: GamePhase, winner: PieceColor | null): string {
  if (phase === 'checkmate') {
    return `${winner === 'w' ? 'White' : 'Black'} wins!`
  }
  if (phase === 'stalemate') return 'Stalemate!'
  if (phase === 'draw') return 'Draw!'
  return 'Game Over'
}

function getIcon(phase: GamePhase): string {
  if (phase === 'checkmate') return '🏆'
  if (phase === 'stalemate') return '🤝'
  if (phase === 'draw') return '🤝'
  return '🎮'
}

function getSubtitle(phase: GamePhase): string {
  if (phase === 'checkmate') return 'Checkmate'
  if (phase === 'stalemate') return 'Neither player can move'
  if (phase === 'draw') return 'The game is a draw'
  return ''
}

export const GameOverModal = memo(function GameOverModal({
  phase, winner, onNewGame, onReview
}: GameOverModalProps) {
  const isGameOver = phase === 'checkmate' || phase === 'stalemate' || phase === 'draw'
  if (!isGameOver) return null

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Game over" data-testid="game-over-modal">
      <div className={styles.modal}>
        <div className={styles.icon}>{getIcon(phase)}</div>
        <h2 className={styles.title}>{getTitle(phase, winner)}</h2>
        <p className={styles.subtitle}>{getSubtitle(phase)}</p>
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.primary}`}
            onClick={onNewGame}
            data-testid="game-over-new-game"
            autoFocus
          >
            🔄 New Game
          </button>
          <button
            className={`${styles.btn} ${styles.secondary}`}
            onClick={onReview}
            data-testid="game-over-review"
          >
            📋 Review Game
          </button>
        </div>
      </div>
    </div>
  )
})
