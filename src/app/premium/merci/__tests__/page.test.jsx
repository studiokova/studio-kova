import { render, screen } from '@testing-library/react'
import PremiumMerciPage from '../page'

jest.mock('@/components/kova/KovaFooter', () => () => <footer role="contentinfo" />)

describe('PremiumMerciPage', () => {
  it('se rend sans erreur', () => {
    render(<PremiumMerciPage />)
  })

  it('affiche le titre "C\'est noté."', () => {
    render(<PremiumMerciPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("C'est noté.")
  })

  it('affiche le message sur le délai de 48h et le moodboard', () => {
    render(<PremiumMerciPage />)
    expect(screen.getByText(/48h/)).toBeInTheDocument()
    expect(screen.getByText(/moodboard/)).toBeInTheDocument()
  })

  it('affiche le lien mailto hello@studiokova.fr', () => {
    render(<PremiumMerciPage />)
    const link = screen.getByRole('link', { name: /hello@studiokova\.fr/ })
    expect(link).toHaveAttribute('href', 'mailto:hello@studiokova.fr')
  })

  it('affiche le footer', () => {
    render(<PremiumMerciPage />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
