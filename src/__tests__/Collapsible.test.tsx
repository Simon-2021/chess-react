import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Collapsible } from '../components/Collapsible/Collapsible'

describe('Collapsible', () => {
  it('renders title', () => {
    render(<Collapsible title="Test Section"><div>content</div></Collapsible>)
    expect(screen.getByText('Test Section')).toBeInTheDocument()
  })

  it('shows content when defaultOpen=true', () => {
    render(<Collapsible title="Open" defaultOpen={true}><div>visible content</div></Collapsible>)
    expect(screen.getByText('visible content')).toBeInTheDocument()
  })

  it('hides content when defaultOpen=false', () => {
    render(<Collapsible title="Closed" defaultOpen={false}><div>hidden content</div></Collapsible>)
    expect(screen.queryByText('hidden content')).not.toBeInTheDocument()
  })

  it('toggles content on header click', () => {
    render(<Collapsible title="Toggle" defaultOpen={false}><div>toggle content</div></Collapsible>)
    expect(screen.queryByText('toggle content')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('toggle content')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button'))
    expect(screen.queryByText('toggle content')).not.toBeInTheDocument()
  })

  it('sets aria-expanded correctly', () => {
    render(<Collapsible title="Aria" defaultOpen={true}><div>content</div></Collapsible>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })
})
