import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Controls } from '../components/Controls/Controls'

describe('Controls', () => {
  it('renders all buttons', () => {
    render(<Controls onNewGame={vi.fn()} onUndo={vi.fn()} onFlipBoard={vi.fn()} canUndo={true} />)
    expect(screen.getByTestId('new-game-btn')).toBeInTheDocument()
    expect(screen.getByTestId('undo-btn')).toBeInTheDocument()
    expect(screen.getByTestId('flip-btn')).toBeInTheDocument()
  })

  it('calls onNewGame when new game button clicked', () => {
    const onNewGame = vi.fn()
    render(<Controls onNewGame={onNewGame} onUndo={vi.fn()} onFlipBoard={vi.fn()} canUndo={true} />)
    fireEvent.click(screen.getByTestId('new-game-btn'))
    expect(onNewGame).toHaveBeenCalledOnce()
  })

  it('calls onUndo when undo button clicked', () => {
    const onUndo = vi.fn()
    render(<Controls onNewGame={vi.fn()} onUndo={onUndo} onFlipBoard={vi.fn()} canUndo={true} />)
    fireEvent.click(screen.getByTestId('undo-btn'))
    expect(onUndo).toHaveBeenCalledOnce()
  })

  it('disables undo button when canUndo is false', () => {
    render(<Controls onNewGame={vi.fn()} onUndo={vi.fn()} onFlipBoard={vi.fn()} canUndo={false} />)
    expect(screen.getByTestId('undo-btn')).toBeDisabled()
  })

  it('enables undo button when canUndo is true', () => {
    render(<Controls onNewGame={vi.fn()} onUndo={vi.fn()} onFlipBoard={vi.fn()} canUndo={true} />)
    expect(screen.getByTestId('undo-btn')).not.toBeDisabled()
  })

  it('calls onFlipBoard when flip button clicked', () => {
    const onFlipBoard = vi.fn()
    render(<Controls onNewGame={vi.fn()} onUndo={vi.fn()} onFlipBoard={onFlipBoard} canUndo={true} />)
    fireEvent.click(screen.getByTestId('flip-btn'))
    expect(onFlipBoard).toHaveBeenCalledOnce()
  })
})
