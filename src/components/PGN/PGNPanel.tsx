import { useState, useCallback } from 'react'
import type { Move } from 'chess.js'
import { generatePGN, importPGN, copyToClipboard, downloadPGN } from '../../utils/pgn'
import type { GameState } from '../../types/chess'
import styles from './PGNPanel.module.css'

interface PGNPanelProps {
  moves: Move[]
  state: GameState
  onImport: (pgn: string) => void
}

function getResultString(state: GameState): string {
  if (state.phase === 'checkmate') {
    return state.winner === 'w' ? '1-0' : '0-1'
  }
  if (state.phase === 'stalemate' || state.phase === 'draw') return '1/2-1/2'
  return '*'
}

export function PGNPanel({ moves, state, onImport }: PGNPanelProps) {
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showImport, setShowImport] = useState(false)

  const pgn = generatePGN(moves, getResultString(state))

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(pgn)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [pgn])

  const handleDownload = useCallback(() => {
    const date = new Date().toISOString().split('T')[0]
    downloadPGN(pgn, `chess-${date}.pgn`)
  }, [pgn])

  const handleImport = useCallback(() => {
    if (!importText.trim()) return
    const { error } = importPGN(importText)
    if (error) {
      setImportError(error)
      return
    }
    setImportError(null)
    onImport(importText)
    setImportText('')
    setShowImport(false)
  }, [importText, onImport])

  return (
    <div className={styles.container} data-testid="pgn-panel">
      <div className={styles.header}>
        <h3 className={styles.title}>PGN</h3>
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={handleCopy}
            data-testid="pgn-copy-btn"
            disabled={moves.length === 0}
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
          <button
            className={styles.actionBtn}
            onClick={handleDownload}
            data-testid="pgn-download-btn"
            disabled={moves.length === 0}
          >
            ⬇ Save
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => setShowImport(!showImport)}
            data-testid="pgn-import-toggle"
          >
            ⬆ Load
          </button>
        </div>
      </div>

      {moves.length > 0 && (
        <div className={styles.pgnText} data-testid="pgn-text">
          {pgn}
        </div>
      )}

      {showImport && (
        <div className={styles.importSection}>
          <textarea
            className={styles.importInput}
            placeholder="Paste PGN here..."
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={4}
            data-testid="pgn-import-input"
          />
          {importError && (
            <div className={styles.error} data-testid="pgn-error">
              {importError}
            </div>
          )}
          <button
            className={styles.importBtn}
            onClick={handleImport}
            disabled={!importText.trim()}
            data-testid="pgn-import-btn"
          >
            Load Game
          </button>
        </div>
      )}
    </div>
  )
}
