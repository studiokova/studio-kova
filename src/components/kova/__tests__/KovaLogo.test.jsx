import { render, screen } from '@testing-library/react'
import KovaLogo from '../KovaLogo'

describe('KovaLogo', () => {
  it('se rend avec le texte Studio et Kova', () => {
    render(<KovaLogo />)
    expect(screen.getByText('Studio')).toBeInTheDocument()
    expect(screen.getByText('Kova')).toBeInTheDocument()
  })

  it('lien par défaut pointe vers /', () => {
    render(<KovaLogo />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/')
  })

  it('lien personnalisé avec href', () => {
    render(<KovaLogo href="/accueil" />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/accueil')
  })

  it('variante dark ajoute la classe kova-logo--dark', () => {
    render(<KovaLogo variant="dark" />)
    expect(screen.getByRole('link')).toHaveClass('kova-logo--dark')
  })

  it('variante light ajoute la classe kova-logo--light', () => {
    render(<KovaLogo variant="light" />)
    expect(screen.getByRole('link')).toHaveClass('kova-logo--light')
  })

  it('size par défaut est 28', () => {
    const { container } = render(<KovaLogo />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '28')
    expect(svg).toHaveAttribute('height', '28')
  })

  it('size personnalisé', () => {
    const { container } = render(<KovaLogo size={40} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '40')
  })
})
