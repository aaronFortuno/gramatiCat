import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MedalBadge from './MedalBadge'
import type { Medal } from '../../types/gamification'

const medal: Medal = {
  id: 'bronze-ortografia',
  nom: 'Bronze de Ortografia',
  descripcio: 'Aconsegueix >= 50%.',
  icona: '🥉',
  condicio: '>= 50%',
}

describe('MedalBadge', () => {
  it('shows medal icon and name when earned', () => {
    render(<MedalBadge medal={medal} earned={true} />)
    expect(screen.getByText('🥉')).toBeInTheDocument()
    expect(screen.getByText('Bronze de Ortografia')).toBeInTheDocument()
  })

  it('shows lock icon when not earned', () => {
    render(<MedalBadge medal={medal} earned={false} />)
    expect(screen.getByText('🔒')).toBeInTheDocument()
    expect(screen.queryByText('🥉')).not.toBeInTheDocument()
  })

  it('shows description always', () => {
    render(<MedalBadge medal={medal} earned={false} />)
    expect(screen.getByText('Aconsegueix >= 50%.')).toBeInTheDocument()
  })

  it('shows earned date when provided', () => {
    render(<MedalBadge medal={medal} earned={true} earnedDate="2025-06-15T10:00:00Z" />)
    // Catalan locale date format
    const dateText = screen.getByText(/2025/)
    expect(dateText).toBeInTheDocument()
  })

  it('applies grayscale class when not earned', () => {
    const { container } = render(<MedalBadge medal={medal} earned={false} />)
    const div = container.firstChild as HTMLElement
    expect(div.className).toContain('grayscale')
  })

  it('does not apply grayscale when earned', () => {
    const { container } = render(<MedalBadge medal={medal} earned={true} />)
    const div = container.firstChild as HTMLElement
    expect(div.className).not.toContain('grayscale')
  })
})
