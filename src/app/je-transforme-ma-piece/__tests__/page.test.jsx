import { render, screen } from '@testing-library/react'
import JeTransformeMaPiecePage from '../page'

jest.mock('@/components/kova/KovaNav', () => () => <nav role="navigation" />)
jest.mock('@/components/kova/KovaBadge', () => ({ children }) => <span>{children}</span>)
jest.mock('@/components/kova/CheckList', () => () => <ul data-testid="checklist" />)
jest.mock('@/components/kova/KovaButton', () => ({ children, href }) => <a href={href}>{children}</a>)
jest.mock('@/components/kova/KovaFooter', () => () => <footer role="contentinfo" />)
jest.mock('next/image', () => function MockImage({ alt, ...props }) {
  return <img alt={alt} {...props} />
})

describe('JeTransformeMaPiecePage', () => {
  it('se rend sans erreur', () => {
    render(<JeTransformeMaPiecePage />)
  })

  it('affiche le titre principal', () => {
    render(<JeTransformeMaPiecePage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Je transforme ma pièce')
  })

  it('affiche le badge "Populaire"', () => {
    render(<JeTransformeMaPiecePage />)
    expect(screen.getByText('Populaire')).toBeInTheDocument()
  })

  it('affiche le prix de l\'offre analyse (49€)', () => {
    render(<JeTransformeMaPiecePage />)
    expect(screen.getAllByText(/49€/).length).toBeGreaterThan(0)
  })

  it('affiche la checklist des livrables', () => {
    render(<JeTransformeMaPiecePage />)
    expect(screen.getByTestId('checklist')).toBeInTheDocument()
  })

  it('affiche le lien CTA vers /analyse', () => {
    render(<JeTransformeMaPiecePage />)
    const link = screen.getByRole('link', { name: /Je transforme ma pièce/ })
    expect(link).toHaveAttribute('href', '/analyse')
  })

  it('affiche la navigation et le footer', () => {
    render(<JeTransformeMaPiecePage />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('affiche l\'exemple PDF', () => {
    render(<JeTransformeMaPiecePage />)
    expect(screen.getByAltText(/Exemple de livrable PDF/)).toBeInTheDocument()
  })

  it('affiche le lien email de contact', () => {
    render(<JeTransformeMaPiecePage />)
    const link = screen.getByRole('link', { name: 'hello@studiokova.fr' })
    expect(link).toHaveAttribute('href', expect.stringContaining('hello@studiokova.fr'))
  })
})
