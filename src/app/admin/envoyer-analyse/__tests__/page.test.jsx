import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import EnvoyerAnalysePage from '../page'

beforeEach(() => {
  localStorage.clear()
  global.fetch = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

const ANALYSES = [
  {
    id: 'uuid-1',
    email: 'client@test.fr',
    created_at: '2025-05-01T10:00:00Z',
    pdf_url: 'https://blob.example.com/report.pdf',
    type_piece: 'Salon',
  },
]

describe('EnvoyerAnalysePage — état initial (pas de secret)', () => {
  it('affiche le formulaire de connexion si pas de secret stocké', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ analyses: [] }) })
    render(<EnvoyerAnalysePage />)
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Mot de passe admin/)).toBeInTheDocument()
    })
  })

  it('affiche le bouton Valider dans le formulaire', async () => {
    render(<EnvoyerAnalysePage />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Valider/ })).toBeInTheDocument()
    })
  })
})

describe('EnvoyerAnalysePage — authentification', () => {
  it('authentifie et affiche les analyses après connexion réussie', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ analyses: ANALYSES }),
    })

    render(<EnvoyerAnalysePage />)
    await waitFor(() => screen.getByPlaceholderText(/Mot de passe admin/))

    fireEvent.change(screen.getByPlaceholderText(/Mot de passe admin/), {
      target: { value: 'secret-test' },
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Valider/ }).closest('form'))
    })

    await waitFor(() => {
      expect(screen.getByText('client@test.fr')).toBeInTheDocument()
    })
    expect(localStorage.getItem('studiokova-admin-secret')).toBe('secret-test')
  })

  it('affiche un toast d\'erreur si mot de passe invalide', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false })

    render(<EnvoyerAnalysePage />)
    await waitFor(() => screen.getByPlaceholderText(/Mot de passe admin/))

    fireEvent.change(screen.getByPlaceholderText(/Mot de passe admin/), {
      target: { value: 'mauvais-secret' },
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Valider/ }).closest('form'))
    })

    await waitFor(() => {
      expect(screen.getByText(/Mot de passe invalide/)).toBeInTheDocument()
    })
  })
})

describe('EnvoyerAnalysePage — authentifié depuis localStorage', () => {
  beforeEach(() => {
    localStorage.setItem('studiokova-admin-secret', 'stored-secret')
  })

  it('charge et affiche les analyses depuis localStorage', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ analyses: ANALYSES }),
    })

    await act(async () => {
      render(<EnvoyerAnalysePage />)
    })

    expect(screen.getByText('client@test.fr')).toBeInTheDocument()
    expect(screen.getByText(/Salon/)).toBeInTheDocument()
  })

  it('affiche "Aucune analyse en attente" si liste vide', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ analyses: [] }),
    })

    render(<EnvoyerAnalysePage />)

    await waitFor(() => {
      expect(screen.getByText(/Aucune analyse en attente/)).toBeInTheDocument()
    })
  })

  it('affiche le bouton Se déconnecter', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ analyses: ANALYSES }),
    })

    render(<EnvoyerAnalysePage />)
    await waitFor(() => screen.getByText('client@test.fr'))
    expect(screen.getByRole('button', { name: /Se déconnecter/ })).toBeInTheDocument()
  })

  it('déconnexion efface le localStorage et revient au login', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ analyses: ANALYSES }),
    })

    render(<EnvoyerAnalysePage />)
    await waitFor(() => screen.getByText('client@test.fr'))

    fireEvent.click(screen.getByRole('button', { name: /Se déconnecter/ }))

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Mot de passe admin/)).toBeInTheDocument()
    })
    expect(localStorage.getItem('studiokova-admin-secret')).toBeNull()
  })

  it('envoie l\'analyse et la retire de la liste si succès', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ analyses: ANALYSES }) })
      .mockResolvedValueOnce({ ok: true })

    render(<EnvoyerAnalysePage />)
    await waitFor(() => screen.getByText('client@test.fr'))

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Envoyer à la cliente/ }))
    })

    await waitFor(() => {
      expect(screen.getByText(/Envoyé à client@test\.fr/)).toBeInTheDocument()
      expect(screen.queryByText('client@test.fr')).not.toBeInTheDocument()
    })
  })

  it('affiche un toast d\'erreur si l\'envoi échoue', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ analyses: ANALYSES }) })
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'PDF manquant' }) })

    render(<EnvoyerAnalysePage />)
    await waitFor(() => screen.getByText('client@test.fr'))

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Envoyer à la cliente/ }))
    })

    await waitFor(() => {
      expect(screen.getByText(/PDF manquant/)).toBeInTheDocument()
    })
  })

  it('affiche le lien PDF', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ analyses: ANALYSES }),
    })

    render(<EnvoyerAnalysePage />)
    await waitFor(() => {
      const pdfLink = screen.getByRole('link', { name: /Voir le PDF/ })
      expect(pdfLink).toHaveAttribute('href', 'https://blob.example.com/report.pdf')
    })
  })

  it('affiche la date formatée', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ analyses: ANALYSES }),
    })

    render(<EnvoyerAnalysePage />)
    await waitFor(() => {
      expect(screen.getByText(/1 mai 2025/)).toBeInTheDocument()
    })
  })

  it('affiche les analyses sans type_piece', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        analyses: [{ ...ANALYSES[0], type_piece: null }],
      }),
    })

    render(<EnvoyerAnalysePage />)
    await waitFor(() => {
      expect(screen.getByText('client@test.fr')).toBeInTheDocument()
    })
  })
})

describe('EnvoyerAnalysePage — localStorage avec secret invalide', () => {
  it('revient au login si le secret stocké est invalide', async () => {
    localStorage.setItem('studiokova-admin-secret', 'invalid-secret')
    global.fetch.mockResolvedValueOnce({ ok: false })

    render(<EnvoyerAnalysePage />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Mot de passe admin/)).toBeInTheDocument()
    })
  })
})
