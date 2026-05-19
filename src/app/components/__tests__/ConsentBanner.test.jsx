import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ConsentBanner from '../ConsentBanner'
import { ConsentProvider } from '../ConsentContext'

describe('ConsentBanner', () => {
  beforeEach(() => localStorage.clear())

  it('affiche la bannière quand le consentement n\'est pas encore donné', async () => {
    render(<ConsentProvider><ConsentBanner /></ConsentProvider>)
    await waitFor(() => {
      expect(screen.getByRole('region', { name: /cookies/i })).toBeInTheDocument()
    })
  })

  it('n\'affiche pas la bannière si le consentement est "accepted"', async () => {
    localStorage.setItem('studiokova_consent', 'accepted')
    render(<ConsentProvider><ConsentBanner /></ConsentProvider>)
    await waitFor(() => {
      expect(screen.queryByRole('region', { name: /cookies/i })).not.toBeInTheDocument()
    })
  })

  it('n\'affiche pas la bannière si le consentement est "rejected"', async () => {
    localStorage.setItem('studiokova_consent', 'rejected')
    render(<ConsentProvider><ConsentBanner /></ConsentProvider>)
    await waitFor(() => {
      expect(screen.queryByRole('region', { name: /cookies/i })).not.toBeInTheDocument()
    })
  })

  it('accepte les cookies et masque la bannière', async () => {
    render(<ConsentProvider><ConsentBanner /></ConsentProvider>)
    await waitFor(() => expect(screen.getByRole('button', { name: /Accepter/ })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /Accepter/ }))
    expect(localStorage.getItem('studiokova_consent')).toBe('accepted')
  })

  it('refuse les cookies et masque la bannière', async () => {
    render(<ConsentProvider><ConsentBanner /></ConsentProvider>)
    await waitFor(() => expect(screen.getByRole('button', { name: /Refuser/ })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /Refuser/ }))
    expect(localStorage.getItem('studiokova_consent')).toBe('rejected')
  })

  it('affiche le lien vers la politique de confidentialité', async () => {
    render(<ConsentProvider><ConsentBanner /></ConsentProvider>)
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /En savoir plus/ })
      expect(link).toHaveAttribute('href', '/confidentialite')
    })
  })
})
