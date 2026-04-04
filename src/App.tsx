import { useCallback, useEffect, useRef, useState } from 'react'
import { useChessGame } from './hooks/useChessGame'
import { useGameTimer } from './hooks/useGameTimer'
import { useGameStats, calcMoveStats } from './hooks/useGameStats'
import { Chess } from 'chess.js'
import { getBestMove } from './utils/ai'
import { ChessBoard } from './components/Board/ChessBoard'
import { GameStatus } from './components/GameStatus/GameStatus'
import { MoveHistory } from './components/MoveHistory/MoveHistory'
import { CapturedPieces } from './components/CapturedPieces/CapturedPieces'
import { PromotionDialog } from './components/PromotionDialog/PromotionDialog'
import { Controls } from './components/Controls/Controls'
import { PlayerTimer } from './components/Timer/PlayerTimer'
import { TimeControlSelector } from './components/Timer/TimeControlSelector'
import { StatsPanel } from './components/Stats/StatsPanel'
import { PGNPanel } from './components/PGN/PGNPanel'
import { GameModeSelector } from './components/GameMode/GameModeSelector'
import { Collapsible } from './components/Collapsible/Collapsible'
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher'
import { GameOverModal } from './components/GameOver/GameOverModal'
import { useTheme } from './hooks/useTheme'
import type { GameMode } from './components/GameMode/GameModeSelector'
import type { AIDifficulty } from './utils/ai'
import type { PieceColor } from './types/chess'
import styles from './App.module.css'

function App() {
  const {
    state,
    isViewingHistory,
    selectSquare,
    handlePromotion,
    cancelPromotion,
    undo,
    reset,
    flipBoard,
    onPieceDrop,
    viewMoveAt,
    returnToPresent,
    setTimeoutWinner,
    loadPGN,
  } = useChessGame()

  const [gameMode, setGameMode] = useState<GameMode>('pvp')
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('easy')
  const [playerColor, setPlayerColor] = useState<PieceColor>('w')
  const aiMovingRef = useRef(false)
  const { themeId, currentTheme, themes: _themes, selectTheme } = useTheme()
  void _themes

  const handleTimeout = useCallback(
    (loser: PieceColor) => {
      setTimeoutWinner(loser)
    },
    [setTimeoutWinner]
  )

  const { timerState, selectTimeControl, resetTimer } = useGameTimer(
    state.turn,
    state.phase,
    handleTimeout
  )

  const { sessionStats, recordGameResult, resetStats } = useGameStats()
  const prevPhaseRef = useRef(state.phase)

  // Record game result when game ends
  useEffect(() => {
    const prev = prevPhaseRef.current
    const curr = state.phase
    if (prev !== curr && (curr === 'checkmate' || curr === 'stalemate' || curr === 'draw')) {
      recordGameResult(state.winner, curr)
    }
    prevPhaseRef.current = curr
  }, [state.phase, state.winner, recordGameResult])

  // AI move trigger
  useEffect(() => {
    if (gameMode !== 'vs-ai') return
    if (isViewingHistory) return
    if (state.phase !== 'playing' && state.phase !== 'check') return
    if (state.turn === playerColor) return // Player's turn
    if (aiMovingRef.current) return

    aiMovingRef.current = true
    const delay = setTimeout(() => {
      const tempChess = new Chess(state.fen)
      // Copy move history to temp chess (chess.js only needs FEN for moves)
      const move = getBestMove(tempChess, aiDifficulty)
      if (move) {
        onPieceDrop(move.from, move.to)
      }
      aiMovingRef.current = false
    }, 300) // Small delay for UX

    return () => {
      clearTimeout(delay)
      aiMovingRef.current = false
    }
  }, [state.turn, state.phase, state.fen, gameMode, playerColor, aiDifficulty, isViewingHistory, onPieceDrop])

  const moveStats = calcMoveStats(state.moveHistory)

  const [showGameOverModal, setShowGameOverModal] = useState(true)

  // Re-show modal whenever a new game ends
  useEffect(() => {
    const curr = state.phase
    if (curr === 'checkmate' || curr === 'stalemate' || curr === 'draw') {
      setShowGameOverModal(true)
    }
  }, [state.phase])

  const handleNewGame = useCallback(() => {
    reset()
    resetTimer()
    setShowGameOverModal(false)
  }, [reset, resetTimer])

  const handleModeChange = useCallback((mode: GameMode) => {
    setGameMode(mode)
    reset()
    resetTimer()
  }, [reset, resetTimer])

  // Derive last move announcement for aria-live
  const lastMoveAnnouncement = state.moveHistory.length > 0
    ? `Move: ${state.moveHistory[state.moveHistory.length - 1].san}. ${
        state.phase === 'check' ? 'Check!' :
        state.phase === 'checkmate' ? `Checkmate! ${state.winner === 'w' ? 'White' : 'Black'} wins!` :
        state.phase === 'stalemate' ? 'Stalemate! Draw.' :
        `${state.turn === 'w' ? 'White' : 'Black'}'s turn.`
      }`
    : ''

  return (
    <div className={styles.app} data-testid="app">
      {/* Skip link for accessibility */}
      <a href="#chess-board" className="skip-link">Skip to chess board</a>

      {/* Aria live region for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
        data-testid="aria-live"
      >
        {lastMoveAnnouncement}
      </div>

      <header className={styles.header} role="banner" aria-label="Chess React application header">
        <div className={styles.logo}>
          <span className={styles.logoIcon}>♟</span>
          <span className={styles.logoText}>Chess React</span>
        </div>
        <div className={styles.headerRight}>
          <ThemeSwitcher currentThemeId={themeId} onSelect={selectTheme} />
          <Controls
            onNewGame={handleNewGame}
            onUndo={undo}
            onFlipBoard={flipBoard}
            canUndo={state.moveHistory.length > 0 && !isViewingHistory && gameMode === 'pvp'}
          />
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.boardSection} id="chess-board" aria-label="Chess board">
          {isViewingHistory && (
            <div className={styles.viewingBanner}>
              👁 Viewing history — <button onClick={returnToPresent}>Return to current position</button>
            </div>
          )}
          <div className={styles.timerTop}>
            <PlayerTimer
              color={state.boardFlipped ? 'w' : 'b'}
              timeSeconds={state.boardFlipped ? timerState.whiteTime : timerState.blackTime}
              isActive={(state.boardFlipped ? state.turn === 'w' : state.turn === 'b') && !isViewingHistory}
              isTimedOut={state.boardFlipped ? timerState.whiteTimedOut : timerState.blackTimedOut}
            />
          </div>
          <ChessBoard
            state={state}
            onSquareClick={selectSquare}
            onPieceDrop={onPieceDrop}
            darkSquare={currentTheme.darkSquare}
            lightSquare={currentTheme.lightSquare}
          />
          <div className={styles.timerBottom}>
            <PlayerTimer
              color={state.boardFlipped ? 'b' : 'w'}
              timeSeconds={state.boardFlipped ? timerState.blackTime : timerState.whiteTime}
              isActive={(state.boardFlipped ? state.turn === 'b' : state.turn === 'w') && !isViewingHistory}
              isTimedOut={state.boardFlipped ? timerState.blackTimedOut : timerState.whiteTimedOut}
            />
          </div>
        </section>

        <aside className={styles.sidebar} aria-label="Game information">
          <GameStatus state={state} />
          <GameModeSelector
            mode={gameMode}
            aiDifficulty={aiDifficulty}
            playerColor={playerColor}
            onModeChange={handleModeChange}
            onDifficultyChange={setAiDifficulty}
            onColorChange={setPlayerColor}
          />
          <TimeControlSelector
            current={timerState.timeControl}
            onChange={(tc) => {
              selectTimeControl(tc)
              reset()
            }}
          />
          <MoveHistory
            moves={state.moveHistory}
            viewingMoveIndex={state.viewingMoveIndex}
            onMoveClick={viewMoveAt}
            onReturnToPresent={returnToPresent}
            isViewingHistory={isViewingHistory}
          />
          <CapturedPieces moves={state.moveHistory} />
          <Collapsible title="Statistics" defaultOpen={false}>
            <StatsPanel
              sessionStats={sessionStats}
              moveStats={moveStats}
              onResetStats={resetStats}
            />
          </Collapsible>
          <Collapsible title="PGN" defaultOpen={false}>
            <PGNPanel
              moves={state.moveHistory}
              state={state}
              onImport={loadPGN}
            />
          </Collapsible>
        </aside>
      </main>

      {state.promotionPending && (
        <PromotionDialog
          color={state.promotionPending.color}
          onSelect={handlePromotion}
          onCancel={cancelPromotion}
        />
      )}

      <GameOverModal
        phase={showGameOverModal ? state.phase : 'playing'}
        winner={state.winner}
        onNewGame={handleNewGame}
        onReview={() => {
          setShowGameOverModal(false)
          if (state.moveHistory.length > 0) viewMoveAt(0)
        }}
      />
    </div>
  )
}

export default App
