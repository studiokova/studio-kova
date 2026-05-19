import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ConsentPreferences from '../ConsentPreferences'
import { ConsentProvider, useConsent } from '../ConsentContext'

function OpenButton() {
  const { openPreferences } = useConsent()
  return <button onClick={openPreferences}>Ouvrir les préférences</button>
}

function Wrapper() {
  return (
    <ConsentProvider>
      <OpenButton />
      <ConsentPreferences />
    </ConsentProvider>
  )
}

async function openPanel() {
  fireEvent.click(screen.getByRole('button', { name: /Ouvrir les préférences/ }))
  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
}

describe('ConsentPreferences', () => {
  beforeEach(() => localStorage.clear())

  it('ne rend rien quand le panel est fermé', () => {
    render(<Wrapper />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('affiche le dialog quand ouvert', async () => {
    render(<Wrapper />)
    await openPanel()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Mes préférences de cookies/)).toBeInTheDocument()
  })

  it('ferme le panel en cliquant sur la croix', async () => {
    render(<Wrapper />)
    await openPanel()
    fireEvent.click(screen.getByRole('button', { name: /Fermer/ }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('ferme le panel en cliquant sur "Annuler"', async () => {
    render(<Wrapper />)
    await openPanel()
    fireEvent.click(screen.getByRole('button', { name: /Annuler/ }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('ferme le panel avec la touche Escape', async () => {
    render(<Wrapper />)
    await openPanel()
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('ferme le panel en cliquant sur le backdrop', async () => {
    render(<Wrapper />)
    await openPanel()
    const backdrop = document.querySelector('.cp-overlay')
    fireEvent.click(backdrop)
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('le toggle démarre à off quand consent est null', async () => {
    render(<Wrapper />)
    await openPanel()
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('le toggle démarre à on quand consent est "accepted"', async () => {
    localStorage.setItem('studiokova_consent', 'accepted')
    render(<Wrapper />)
    await openPanel()
    await waitFor(() => {
      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('aria-checked', 'true')
    })
  })

  it('enregistrer avec toggle=on appelle acceptAll', async () => {
    render(<Wrapper />)
    await openPanel()
    fireEvent.click(screen.getByRole('switch'))
    fireEvent.click(screen.getByRole('button', { name: /Enregistrer/ }))
    expect(localStorage.getItem('studiokova_consent')).toBe('accepted')
  })

  it('enregistrer avec toggle=off appelle rejectAll', async () => {
    localStorage.setItem('studiokova_consent', 'accepted')
    render(<Wrapper />)
    await openPanel()
    await waitFor(() => {
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
    })
    fireEvent.click(screen.getByRole('switch'))
    fireEvent.click(screen.getByRole('button', { name: /Enregistrer/ }))
    expect(localStorage.getItem('studiokova_consent')).toBe('rejected')
  })
})
