import { render, screen } from '@testing-library/react'
import KovaHeading from '../KovaHeading'

describe('KovaHeading', () => {
  it('se rend comme h2 par défaut', () => {
    render(<KovaHeading>Titre</KovaHeading>)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('applique le niveau spécifié', () => {
    render(<KovaHeading level="h1">Titre principal</KovaHeading>)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('applique kova-heading--italic si italic est vrai', () => {
    render(<KovaHeading italic>Titre</KovaHeading>)
    expect(screen.getByRole('heading')).toHaveClass('kova-heading--italic')
  })

  it('n\'applique pas kova-heading--italic si italic est faux', () => {
    render(<KovaHeading>Titre</KovaHeading>)
    expect(screen.getByRole('heading')).not.toHaveClass('kova-heading--italic')
  })

  it('applique kova-heading--light si light est vrai', () => {
    render(<KovaHeading light>Titre</KovaHeading>)
    expect(screen.getByRole('heading')).toHaveClass('kova-heading--light')
  })

  it('n\'applique pas kova-heading--light si light est faux', () => {
    render(<KovaHeading>Titre</KovaHeading>)
    expect(screen.getByRole('heading')).not.toHaveClass('kova-heading--light')
  })

  it('applique kova-heading--muted si muted est vrai', () => {
    render(<KovaHeading muted>Titre</KovaHeading>)
    expect(screen.getByRole('heading')).toHaveClass('kova-heading--muted')
  })

  it('n\'applique pas kova-heading--muted si muted est faux', () => {
    render(<KovaHeading>Titre</KovaHeading>)
    expect(screen.getByRole('heading')).not.toHaveClass('kova-heading--muted')
  })

  it('accepte une className additionnelle', () => {
    render(<KovaHeading className="custom-class">Titre</KovaHeading>)
    expect(screen.getByRole('heading')).toHaveClass('custom-class')
  })
})
