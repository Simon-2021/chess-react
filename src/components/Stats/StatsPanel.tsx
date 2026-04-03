import type { SessionStats, MoveStats } from '../../hooks/useGameStats'
import styles from './StatsPanel.module.css'

interface StatsPanelProps {
  sessionStats: SessionStats
  moveStats: MoveStats
  onResetStats: () => void
}

function winRate(wins: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((wins / total) * 100)}%`
}

export function StatsPanel({ sessionStats, moveStats, onResetStats }: StatsPanelProps) {
  const { gamesPlayed, whiteWins, blackWins, draws } = sessionStats

  return (
    <div className={styles.container} data-testid="stats-panel">
      <div className={styles.header}>
        <h3 className={styles.title}>Statistics</h3>
        {gamesPlayed > 0 && (
          <button className={styles.resetBtn} onClick={onResetStats} title="Reset stats">
            ✕
          </button>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Session Results ({gamesPlayed} games)</div>
        <div className={styles.results} data-testid="session-results">
          <div className={styles.result}>
            <span className={styles.resultLabel}>White</span>
            <span className={styles.resultCount} data-testid="white-wins">{whiteWins}</span>
            <span className={styles.resultRate}>{winRate(whiteWins, gamesPlayed)}</span>
          </div>
          <div className={styles.result}>
            <span className={styles.resultLabel}>Draw</span>
            <span className={styles.resultCount} data-testid="draws">{draws}</span>
            <span className={styles.resultRate}>{winRate(draws, gamesPlayed)}</span>
          </div>
          <div className={styles.result}>
            <span className={styles.resultLabel}>Black</span>
            <span className={styles.resultCount} data-testid="black-wins">{blackWins}</span>
            <span className={styles.resultRate}>{winRate(blackWins, gamesPlayed)}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Current Game</div>
        <div className={styles.metrics} data-testid="move-stats">
          <div className={styles.metric}>
            <span className={styles.metricValue}>{moveStats.totalMoves}</span>
            <span className={styles.metricLabel}>Moves</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{moveStats.captures}</span>
            <span className={styles.metricLabel}>Captures</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{moveStats.checks}</span>
            <span className={styles.metricLabel}>Checks</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{moveStats.longestNonCapture}</span>
            <span className={styles.metricLabel}>Max quiet</span>
          </div>
        </div>
      </div>
    </div>
  )
}
