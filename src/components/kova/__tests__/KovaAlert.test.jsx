import { render, screen, fireEvent } from '@testing-library/react'
import KovaAlert from '../KovaAlert'

describe('KovaAlert', () => {
  it('se rend sans erreur', () => {
    render(<KovaAlert message="Test" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('affiche le message', () => {
    render(<KovaAlert message="Erreur de chargement" />)
    expect(screen.getByText('Erreur de chargement')).toBeInTheDocument()
  })

  it('utilise le type "error" par défaut', () => {
    render(<KovaAlert message="Test" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('se rend en mode success', () => {
    render(<KovaAlert type="success" message="Sauvegardé !" />)
    expect(screen.getByText('Sauvegardé !')).toBeInTheDocument()
  })

  it('se rend en mode info', () => {
    render(<KovaAlert type="info" message="Profil retrouvé" />)
    expect(screen.getByText('Profil retrouvé')).toBeInTheDocument()
  })

  it('n\'affiche pas le bouton fermer si onDismiss absent', () => {
    render(<KovaAlert message="Test" />)
    expect(screen.queryByRole('button', { name: /Fermer/ })).not.toBeInTheDocument()
  })

  it('affiche le bouton fermer si onDismiss fourni', () => {
    render(<KovaAlert message="Test" onDismiss={jest.fn()} />)
    expect(screen.getByRole('button', { name: /Fermer/ })).toBeInTheDocument()
  })

  it('appelle onDismiss au clic sur fermer', () => {
    const onDismiss = jest.fn()
    render(<KovaAlert message="Test" onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: /Fermer/ }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('augmente l\'opacité du bouton au survol', () => {
    render(<KovaAlert message="Test" onDismiss={jest.fn()} />)
    const btn = screen.getByRole('button', { name: /Fermer/ })
    fireEvent.mouseEnter(btn)
    expect(btn.style.opacity).toBe('1')
  })

  it('rétablit l\'opacité en quittant le bouton', () => {
    render(<KovaAlert message="Test" onDismiss={jest.fn()} />)
    const btn = screen.getByRole('button', { name: /Fermer/ })
    fireEvent.mouseEnter(btn)
    fireEvent.mouseLeave(btn)
    expect(btn.style.opacity).toBe('0.6')
  })
})
