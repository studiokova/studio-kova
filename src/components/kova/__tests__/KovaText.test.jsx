import { render, screen } from '@testing-library/react'
import KovaText from '../KovaText'

describe('KovaText', () => {
  it('se rend comme un paragraphe par défaut', () => {
    render(<KovaText>Texte</KovaText>)
    expect(screen.getByText('Texte').tagName).toBe('P')
  })

  it('rend une balise personnalisée avec as', () => {
    render(<KovaText as="span">Span</KovaText>)
    expect(screen.getByText('Span').tagName).toBe('SPAN')
  })

  it('applique la classe kova-text--md par défaut', () => {
    render(<KovaText>Texte</KovaText>)
    expect(screen.getByText('Texte')).toHaveClass('kova-text--md')
  })

  it('applique la classe kova-text--sm avec size="sm"', () => {
    render(<KovaText size="sm">Texte</KovaText>)
    expect(screen.getByText('Texte')).toHaveClass('kova-text--sm')
  })

  it('applique kova-text--muted si muted est vrai', () => {
    render(<KovaText muted>Texte</KovaText>)
    expect(screen.getByText('Texte')).toHaveClass('kova-text--muted')
  })

  it('n\'applique pas kova-text--muted si muted est faux', () => {
    render(<KovaText>Texte</KovaText>)
    expect(screen.getByText('Texte')).not.toHaveClass('kova-text--muted')
  })

  it('applique kova-text--light si light est vrai', () => {
    render(<KovaText light>Texte</KovaText>)
    expect(screen.getByText('Texte')).toHaveClass('kova-text--light')
  })

  it('n\'applique pas kova-text--light si light est faux', () => {
    render(<KovaText>Texte</KovaText>)
    expect(screen.getByText('Texte')).not.toHaveClass('kova-text--light')
  })

  it('applique kova-text--sauge si sauge est vrai', () => {
    render(<KovaText sauge>Texte</KovaText>)
    expect(screen.getByText('Texte')).toHaveClass('kova-text--sauge')
  })

  it('n\'applique pas kova-text--sauge si sauge est faux', () => {
    render(<KovaText>Texte</KovaText>)
    expect(screen.getByText('Texte')).not.toHaveClass('kova-text--sauge')
  })

  it('accepte une className additionnelle', () => {
    render(<KovaText className="custom">Texte</KovaText>)
    expect(screen.getByText('Texte')).toHaveClass('custom')
  })
})
