import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PromotionDialog } from '../components/PromotionDialog/PromotionDialog'

describe('PromotionDialog', () => {
  it('renders for white player', () => {
    render(<PromotionDialog color="w" onSelect={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/promote pawn/i)).toBeInTheDocument()
  })

  it('shows all promotion options', () => {
    render(<PromotionDialog color="w" onSelect={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByTestId('promote-q')).toBeInTheDocument()
    expect(screen.getByTestId('promote-r')).toBeInTheDocument()
    expect(screen.getByTestId('promote-b')).toBeInTheDocument()
    expect(screen.getByTestId('promote-n')).toBeInTheDocument()
  })

  it('calls onSelect with queen when queen button clicked', () => {
    const onSelect = vi.fn()
    render(<PromotionDialog color="w" onSelect={onSelect} onCancel={vi.fn()} />)
    fireEvent.click(screen.getByTestId('promote-q'))
    expect(onSelect).toHaveBeenCalledWith('q')
  })

  it('calls onSelect with rook', () => {
    const onSelect = vi.fn()
    render(<PromotionDialog color="w" onSelect={onSelect} onCancel={vi.fn()} />)
    fireEvent.click(screen.getByTestId('promote-r'))
    expect(onSelect).toHaveBeenCalledWith('r')
  })

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = vi.fn()
    render(<PromotionDialog color="b" onSelect={vi.fn()} onCancel={onCancel} />)
    fireEvent.click(screen.getByText(/cancel/i))
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
