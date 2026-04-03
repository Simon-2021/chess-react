import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PlayerTimer } from '../components/Timer/PlayerTimer'
import { TimeControlSelector } from '../components/Timer/TimeControlSelector'
import { formatTime } from '../hooks/useGameTimer'

describe('formatTime', () => {
  it('formats 0 as 0:00', () => {
    expect(formatTime(0)).toBe('0:00')
  })

  it('formats 65 seconds as 1:05', () => {
    expect(formatTime(65)).toBe('1:05')
  })

  it('formats 600 as 10:00', () => {
    expect(formatTime(600)).toBe('10:00')
  })

  it('formats Infinity as ∞', () => {
    expect(formatTime(Infinity)).toBe('∞')
  })
})

describe('PlayerTimer', () => {
  it('renders white timer', () => {
    render(<PlayerTimer color="w" timeSeconds={300} isActive={true} isTimedOut={false} />)
    expect(screen.getByTestId('timer-w')).toBeInTheDocument()
    expect(screen.getByTestId('time-w')).toHaveTextContent('5:00')
  })

  it('renders black timer', () => {
    render(<PlayerTimer color="b" timeSeconds={180} isActive={false} isTimedOut={false} />)
    expect(screen.getByTestId('timer-b')).toBeInTheDocument()
    expect(screen.getByTestId('time-b')).toHaveTextContent('3:00')
  })

  it('shows infinity for unlimited', () => {
    render(<PlayerTimer color="w" timeSeconds={Infinity} isActive={false} isTimedOut={false} />)
    expect(screen.getByTestId('time-w')).toHaveTextContent('∞')
  })

  it('shows 0:00 when timed out', () => {
    render(<PlayerTimer color="w" timeSeconds={0} isActive={false} isTimedOut={true} />)
    expect(screen.getByTestId('time-w')).toHaveTextContent('0:00')
  })

  it('applies active class when active', () => {
    render(<PlayerTimer color="w" timeSeconds={300} isActive={true} isTimedOut={false} />)
    expect(screen.getByTestId('timer-w').className).toMatch(/active/)
  })
})

describe('TimeControlSelector', () => {
  it('renders all time control options', () => {
    render(<TimeControlSelector current="unlimited" onChange={vi.fn()} />)
    expect(screen.getByTestId('tc-unlimited')).toBeInTheDocument()
    expect(screen.getByTestId('tc-3')).toBeInTheDocument()
    expect(screen.getByTestId('tc-5')).toBeInTheDocument()
    expect(screen.getByTestId('tc-10')).toBeInTheDocument()
    expect(screen.getByTestId('tc-30')).toBeInTheDocument()
  })

  it('highlights current time control', () => {
    render(<TimeControlSelector current={5} onChange={vi.fn()} />)
    expect(screen.getByTestId('tc-5').className).toMatch(/active/)
    expect(screen.getByTestId('tc-10').className).not.toMatch(/active/)
  })

  it('calls onChange when option selected', () => {
    const onChange = vi.fn()
    render(<TimeControlSelector current="unlimited" onChange={onChange} />)
    fireEvent.click(screen.getByTestId('tc-5'))
    expect(onChange).toHaveBeenCalledWith(5)
  })
})
