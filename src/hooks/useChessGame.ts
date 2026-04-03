import { useState, useRef, useCallback, useEffect } from 'react'
import { Chess } from 'chess.js'
import type { Square } from 'chess.js'
import type { GameState, PromotionPiece } from '../types/chess'
import { getGamePhase, calculateCapturedPieces, getWinner } from '../utils/chess'

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

function makeInitialState(): GameState {
  return {
    fen: INITIAL_FEN,
    turn: 'w',
    phase: 'playing',
    moveHistory: [],
    capturedPieces: { w: [], b: [] },
    selectedSquare: null,
    legalMoves: [],
    lastMove: null,
    promotionPending: null,
    winner: null,
    boardFlipped: false,
    elapsedSeconds: 0,
    viewingMoveIndex: -1,
    viewingFen: null,
  }
}

export function useChessGame() {
  const chessRef = useRef<Chess>(new Chess())
  const [state, setState] = useState<GameState>(makeInitialState)

  // Timer
  useEffect(() => {
    if (state.phase !== 'playing' && state.phase !== 'check') return
    const id = setInterval(() => {
      setState((s) => ({ ...s, elapsedSeconds: s.elapsedSeconds + 1 }))
    }, 1000)
    return () => clearInterval(id)
  }, [state.phase])

  // Sync state from chess instance
  const syncState = useCallback(
    (overrides: Partial<GameState> = {}) => {
      const chess = chessRef.current
      const moveHistory = chess.history({ verbose: true })
      const capturedPieces = calculateCapturedPieces(moveHistory)
      const phase = getGamePhase(chess)
      const winner = getWinner(chess)
      setState((prev) => ({
        ...prev,
        fen: chess.fen(),
        turn: chess.turn(),
        phase,
        moveHistory,
        capturedPieces,
        winner,
        selectedSquare: null,
        legalMoves: [],
        ...overrides,
      }))
    },
    []
  )

  const selectSquare = useCallback(
    (square: Square) => {
      const chess = chessRef.current
      const piece = chess.get(square)

      // Clicking own piece — select it
      if (piece && piece.color === chess.turn()) {
        const moves = chess.moves({ square, verbose: true })
        setState((prev) => ({
          ...prev,
          selectedSquare: square,
          legalMoves: moves.map((m) => m.to as Square),
        }))
        return
      }

      // Clicking a legal target while a piece is selected
      const { selectedSquare } = state
      if (selectedSquare && state.legalMoves.includes(square)) {
        const moves = chess.moves({ square: selectedSquare, verbose: true })
        const target = moves.find((m) => m.to === square)

        // Needs promotion?
        if (target?.flags?.includes('p')) {
          setState((prev) => ({
            ...prev,
            selectedSquare: null,
            legalMoves: [],
            promotionPending: {
              from: selectedSquare,
              to: square,
              color: chess.turn(),
            },
          }))
          return
        }

        // Execute move
        try {
          const result = chess.move({ from: selectedSquare, to: square })
          if (result) {
            syncState({ lastMove: { from: selectedSquare, to: square } })
            return
          }
        } catch {
          // ignore
        }
      }

      // Deselect
      setState((prev) => ({ ...prev, selectedSquare: null, legalMoves: [] }))
    },
    [state, syncState]
  )

  const handlePromotion = useCallback(
    (piece: PromotionPiece) => {
      const { promotionPending } = state
      if (!promotionPending) return
      const chess = chessRef.current
      try {
        chess.move({ from: promotionPending.from, to: promotionPending.to, promotion: piece })
        syncState({ lastMove: { from: promotionPending.from, to: promotionPending.to } })
      } catch {
        setState((prev) => ({ ...prev, promotionPending: null }))
      }
    },
    [state, syncState]
  )

  const cancelPromotion = useCallback(() => {
    setState((prev) => ({ ...prev, promotionPending: null }))
  }, [])

  const undo = useCallback(() => {
    const chess = chessRef.current
    chess.undo()
    const moveHistory = chess.history({ verbose: true })
    const lastMove =
      moveHistory.length > 0
        ? {
            from: moveHistory[moveHistory.length - 1].from as Square,
            to: moveHistory[moveHistory.length - 1].to as Square,
          }
        : null
    syncState({ lastMove })
  }, [syncState])

  const reset = useCallback(() => {
    chessRef.current.reset()
    setState(makeInitialState())
  }, [])

  const setTimeoutWinner = useCallback((loser: 'w' | 'b') => {
    setState((prev) => ({
      ...prev,
      phase: 'checkmate', // reuse checkmate phase for display
      winner: loser === 'w' ? 'b' : 'w',
    }))
  }, [])

  const loadPGN = useCallback((pgnText: string) => {
    try {
      const chess = chessRef.current
      chess.loadPgn(pgnText)
      syncState({ viewingMoveIndex: -1, viewingFen: null })
    } catch {
      // ignore invalid PGN
    }
  }, [syncState])

  const flipBoard = useCallback(() => {
    setState((prev) => ({ ...prev, boardFlipped: !prev.boardFlipped }))
  }, [])

  const viewMoveAt = useCallback((moveIndex: number) => {
    setState((prev) => {
      if (moveIndex < 0 || moveIndex >= prev.moveHistory.length) return prev
      // Reconstruct FEN at moveIndex by replaying moves
      const tempChess = new Chess()
      for (let i = 0; i <= moveIndex; i++) {
        const m = prev.moveHistory[i]
        tempChess.move({ from: m.from as Square, to: m.to as Square, promotion: m.promotion as string | undefined })
      }
      return {
        ...prev,
        viewingMoveIndex: moveIndex,
        viewingFen: tempChess.fen(),
        selectedSquare: null,
        legalMoves: [],
      }
    })
  }, [])

  const returnToPresent = useCallback(() => {
    setState((prev) => ({
      ...prev,
      viewingMoveIndex: -1,
      viewingFen: null,
      selectedSquare: null,
      legalMoves: [],
    }))
  }, [])

  const onPieceDrop = useCallback(
    (sourceSquare: string, targetSquare: string): boolean => {
      const chess = chessRef.current
      const from = sourceSquare as Square
      const to = targetSquare as Square

      // Check legality
      const moves = chess.moves({ square: from, verbose: true })
      const move = moves.find((m) => m.to === to)
      if (!move) return false

      // Promotion needed?
      if (move.flags?.includes('p')) {
        setState((prev) => ({
          ...prev,
          selectedSquare: null,
          legalMoves: [],
          promotionPending: { from, to, color: chess.turn() },
        }))
        return true
      }

      // Execute move
      try {
        chess.move({ from, to })
        syncState({ lastMove: { from, to } })
        return true
      } catch {
        return false
      }
    },
    [syncState]
  )

  // Derived: the FEN to display (viewing history vs live)
  const isViewingHistory = state.viewingMoveIndex >= 0
  const displayFen = state.viewingFen ?? state.fen

  return {
    state: { ...state, fen: displayFen },
    isViewingHistory,
    selectSquare: isViewingHistory ? () => {} : selectSquare,
    handlePromotion,
    cancelPromotion,
    undo,
    reset,
    flipBoard,
    onPieceDrop: isViewingHistory ? () => false : onPieceDrop,
    viewMoveAt,
    returnToPresent,
    setTimeoutWinner,
    loadPGN,
  }
}
