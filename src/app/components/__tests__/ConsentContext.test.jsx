import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ConsentProvider, useConsent } from '../ConsentContext'

function TestConsumer() {
  const {
    consent, isLoaded, isPreferencesOpen,
    acceptAll, rejectAll, resetConsent,
    openPreferences, closePreferences,
  } = useConsent()
  return (
    <div>
      <div data-testid="consent">{consent ?? 'null'}</div>
      <div data-testid="loaded">{String(isLoaded)}</div>
      <div data-testid="prefs-open">{String(isPreferencesOpen)}</div>
      <button onClick={acceptAll}>Accept</button>
      <button onClick={rejectAll}>Reject</button>
      <button onClick={resetConsent}>Reset</button>
      <button onClick={openPreferences}>Open</button>
      <button onClick={closePreferences}>Close</button>
    </div>
  )
}

describe('ConsentContext', () => {
  beforeEach(() => localStorage.clear())

  it('consent est null et isLoaded false au rendu initial', () => {
    render(<ConsentProvider><TestConsumer /></ConsentProvider>)
    expect(screen.getByTestId('consent')).toHaveTextContent('null')
  })

  it('isLoaded passe à true après lecture du localStorage', async () => {
    render(<ConsentProvider><TestConsumer /></ConsentProvider>)
    await waitFor(() => {
      expect(screen.getByTestId('loaded')).toHaveTextContent('true')
    })
  })

  it('lit un consentement "accepted" depuis localStorage', async () => {
    localStorage.setItem('studiokova_consent', 'accepted')
    render(<ConsentProvider><TestConsumer /></ConsentProvider>)
    await waitFor(() => {
      expect(screen.getByTestId('consent')).toHaveTextContent('accepted')
    })
  })

  it('lit un consentement "rejected" depuis localStorage', async () => {
    localStorage.setItem('studiokova_consent', 'rejected')
    render(<ConsentProvider><TestConsumer /></ConsentProvider>)
    await waitFor(() => {
      expect(screen.getByTestId('consent')).toHaveTextContent('rejected')
    })
  })

  it('acceptAll met à jour consent et localStorage', async () => {
    render(<ConsentProvider><TestConsumer /></ConsentProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'Accept' }))
    await waitFor(() => {
      expect(screen.getByTestId('consent')).toHaveTextContent('accepted')
    })
    expect(localStorage.getItem('studiokova_consent')).toBe('accepted')
  })

  it('rejectAll met à jour consent et localStorage', async () => {
    render(<ConsentProvider><TestConsumer /></ConsentProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }))
    await waitFor(() => {
      expect(screen.getByTestId('consent')).toHaveTextContent('rejected')
    })
    expect(localStorage.getItem('studiokova_consent')).toBe('rejected')
  })

  it('resetConsent remet consent à null et vide localStorage', async () => {
    localStorage.setItem('studiokova_consent', 'accepted')
    render(<ConsentProvider><TestConsumer /></ConsentProvider>)
    await waitFor(() => expect(screen.getByTestId('consent')).toHaveTextContent('accepted'))
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    await waitFor(() => {
      expect(screen.getByTestId('consent')).toHaveTextContent('null')
    })
    expect(localStorage.getItem('studiokova_consent')).toBeNull()
  })

  it('openPreferences et closePreferences gèrent isPreferencesOpen', () => {
    render(<ConsentProvider><TestConsumer /></ConsentProvider>)
    expect(screen.getByTestId('prefs-open')).toHaveTextContent('false')
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByTestId('prefs-open')).toHaveTextContent('true')
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.getByTestId('prefs-open')).toHaveTextContent('false')
  })

  it('useConsent fournit un fallback si utilisé hors provider', () => {
    render(<TestConsumer />)
    expect(screen.getByTestId('consent')).toHaveTextContent('null')
    expect(screen.getByTestId('loaded')).toHaveTextContent('false')
  })

  it('les fonctions fallback sont appelables sans lever d\'erreur', () => {
    render(<TestConsumer />)
    fireEvent.click(screen.getByRole('button', { name: 'Accept' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
  })
})
