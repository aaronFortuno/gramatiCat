import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StreakCounter from './StreakCounter'

describe('StreakCounter', () => {
  it('renders nothing when streak is 0', () => {
    const { container } = render(<StreakCounter streak={0} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders the streak count when > 0', () => {
    render(<StreakCounter streak={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders fire emoji', () => {
    render(<StreakCounter streak={3} />)
    expect(screen.getByText('🔥')).toBeInTheDocument()
  })

  it('updates displayed count when streak changes', () => {
    const { rerender } = render(<StreakCounter streak={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
    rerender(<StreakCounter streak={7} />)
    expect(screen.getByText('7')).toBeInTheDocument()
  })
})
