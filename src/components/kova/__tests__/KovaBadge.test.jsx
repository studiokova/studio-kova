import { render, screen } from '@testing-library/react'
import KovaBadge from '../KovaBadge'

describe('KovaBadge', () => {
  it('se rend avec la classe kova-badge', () => {
    render(<KovaBadge>Gratuit</KovaBadge>)
    expect(screen.getByText('Gratuit')).toHaveClass('kova-badge')
  })

  it('variante default n\'ajoute pas de classe modificateur', () => {
    render(<KovaBadge variant="default">Test</KovaBadge>)
    const badge = screen.getByText('Test')
    expect(badge.className).toBe('kova-badge')
  })

  it('variante gold ajoute la classe kova-badge--gold', () => {
    render(<KovaBadge variant="gold">Gold</KovaBadge>)
    expect(screen.getByText('Gold')).toHaveClass('kova-badge--gold')
  })

  it('variante copper ajoute la classe kova-badge--copper', () => {
    render(<KovaBadge variant="copper">Copper</KovaBadge>)
    expect(screen.getByText('Copper')).toHaveClass('kova-badge--copper')
  })

  it('variante dark ajoute la classe kova-badge--dark', () => {
    render(<KovaBadge variant="dark">Dark</KovaBadge>)
    expect(screen.getByText('Dark')).toHaveClass('kova-badge--dark')
  })

  it('variante eyebrow ajoute la classe kova-badge--eyebrow', () => {
    render(<KovaBadge variant="eyebrow">Nouveau</KovaBadge>)
    expect(screen.getByText('Nouveau')).toHaveClass('kova-badge--eyebrow')
  })

  it('accepte une className additionnelle', () => {
    render(<KovaBadge className="extra-class">Test</KovaBadge>)
    expect(screen.getByText('Test')).toHaveClass('extra-class')
  })
})
