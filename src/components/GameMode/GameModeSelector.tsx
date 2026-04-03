import type { AIDifficulty } from '../../utils/ai'
import type { PieceColor } from '../../types/chess'
import styles from './GameModeSelector.module.css'

export type GameMode = 'pvp' | 'vs-ai'

interface GameModeSelectorProps {
  mode: GameMode
  aiDifficulty: AIDifficulty
  playerColor: PieceColor
  onModeChange: (mode: GameMode) => void
  onDifficultyChange: (d: AIDifficulty) => void
  onColorChange: (c: PieceColor) => void
}

export function GameModeSelector({
  mode, aiDifficulty, playerColor,
  onModeChange, onDifficultyChange, onColorChange
}: GameModeSelectorProps) {
  return (
    <div className={styles.container} data-testid="game-mode-selector">
      <div className={styles.modes}>
        <button
          className={`${styles.modeBtn} ${mode === 'pvp' ? styles.active : ''}`}
          onClick={() => onModeChange('pvp')}
          data-testid="mode-pvp"
        >
          👥 Two Players
        </button>
        <button
          className={`${styles.modeBtn} ${mode === 'vs-ai' ? styles.active : ''}`}
          onClick={() => onModeChange('vs-ai')}
          data-testid="mode-ai"
        >
          🤖 vs Computer
        </button>
      </div>

      {mode === 'vs-ai' && (
        <div className={styles.aiOptions}>
          <div className={styles.option}>
            <span className={styles.label}>Play as:</span>
            <div className={styles.colorBtns}>
              <button
                className={`${styles.colorBtn} ${playerColor === 'w' ? styles.active : ''}`}
                onClick={() => onColorChange('w')}
                data-testid="play-white"
              >
                ♔ White
              </button>
              <button
                className={`${styles.colorBtn} ${playerColor === 'b' ? styles.active : ''}`}
                onClick={() => onColorChange('b')}
                data-testid="play-black"
              >
                ♚ Black
              </button>
            </div>
          </div>
          <div className={styles.option}>
            <span className={styles.label}>Difficulty:</span>
            <div className={styles.diffBtns}>
              <button
                className={`${styles.diffBtn} ${aiDifficulty === 'easy' ? styles.active : ''}`}
                onClick={() => onDifficultyChange('easy')}
                data-testid="diff-easy"
              >
                Easy
              </button>
              <button
                className={`${styles.diffBtn} ${aiDifficulty === 'medium' ? styles.active : ''}`}
                onClick={() => onDifficultyChange('medium')}
                data-testid="diff-medium"
              >
                Medium
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
