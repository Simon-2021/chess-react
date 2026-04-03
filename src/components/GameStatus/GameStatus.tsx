import type { GameState } from '../../types/chess'
import { identifyOpening } from '../../utils/openings'
import styles from './GameStatus.module.css'

interface GameStatusProps {
  state: GameState
}

const phaseMessages: Record<string, (winner?: string) => string> = {
  playing: () => '',
  check: (turn) => `${turn === 'w' ? 'White' : 'Black'} is in Check! ⚠️`,
  checkmate: (winner) => `Checkmate! ${winner === 'w' ? 'White' : 'Black'} wins! 🏆`,
  stalemate: () => 'Stalemate — Draw! 🤝',
  draw: () => 'Draw! 🤝',
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function GameStatus({ state }: GameStatusProps) {
  const { phase, turn, winner, elapsedSeconds, moveHistory } = state
  const isGameOver = phase === 'checkmate' || phase === 'stalemate' || phase === 'draw'

  const statusMsg = phaseMessages[phase]?.(winner ?? turn) ?? ''

  // Identify opening (only in first 20 moves)
  const opening = moveHistory.length <= 20 && moveHistory.length > 0
    ? identifyOpening(moveHistory.map((m) => m.san))
    : null

  return (
    <div className={styles.container} data-testid="game-status">
      {!isGameOver && (
        <div className={`${styles.turn} ${turn === 'w' ? styles.whiteTurn : styles.blackTurn}`}>
          <span className={styles.turnIndicator} />
          <span>{turn === 'w' ? 'White' : 'Black'} to move</span>
        </div>
      )}

      {statusMsg && (
        <div className={`${styles.status} ${isGameOver ? styles.gameOver : styles.check}`} data-testid="status-message">
          {statusMsg}
        </div>
      )}

      {opening && (
        <div className={styles.opening} data-testid="opening-name">
          <span className={styles.openingLabel}>📖</span>
          <span>{opening.name}</span>
          {opening.eco && <span className={styles.eco}>{opening.eco}</span>}
        </div>
      )}

      <div className={styles.timer} data-testid="game-timer">
        ⏱ {formatTime(elapsedSeconds)}
      </div>
    </div>
  )
}
