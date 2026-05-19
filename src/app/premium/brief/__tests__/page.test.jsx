import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import PremiumBriefPage from '../page'

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key) => (key === 'session_id' ? 'cs_test_abc123' : null),
  }),
}))

jest.mock('@/components/kova/KovaFooter', () => () => <footer role="contentinfo" />)
jest.mock('@/components/kova/KovaNav', () => ({ showBack, backLabel, backHref }) => (
  <nav role="navigation"><a href={backHref}>{backLabel}</a></nav>
))

beforeAll(() => {
  window.scrollTo = jest.fn()
  delete window.location
  window.location = { href: '' }
})

// ── Helpers fetch ─────────────────────────────────────────────────────────────

function mockSession(roomsCount = 1) {
  return jest.fn().mockResolvedValueOnce({
    json: () => Promise.resolve({ email: 'client@test.fr', rooms_count: roomsCount }),
  })
}

function mockSessionAndProfile(profile = null, roomsCount = 1) {
  return jest.fn()
    .mockResolvedValueOnce({
      json: () => Promise.resolve({ email: 'client@test.fr', rooms_count: roomsCount }),
    })
    .mockResolvedValueOnce({
      json: () => Promise.resolve({ profile }),
    })
}

async function waitForStep1() {
  await waitFor(() => {
    expect(screen.getByText('On commence par vous')).toBeInTheDocument()
  })
}

function fillStep1(prenom = 'Marie', projet = 'Je veux transformer mon salon.') {
  fireEvent.change(screen.getByPlaceholderText('Marie'), { target: { value: prenom } })
  fireEvent.change(screen.getByPlaceholderText(/Je veux que mon salon/), { target: { value: projet } })
}

async function goToStep2() {
  await waitForStep1()
  fillStep1()
  fireEvent.click(screen.getByRole('button', { name: /Continuer/ }))
  await waitFor(() => {
    expect(screen.getByText('Votre style')).toBeInTheDocument()
  })
}

// ── Structure ────────────────────────────────────────────────────────────────

describe('PremiumBriefPage — chargement', () => {
  it('affiche l\'écran de chargement initialement', () => {
    global.fetch = jest.fn().mockResolvedValue(new Promise(() => {}))
    render(<PremiumBriefPage />)
    expect(screen.getByText('Chargement en cours…')).toBeInTheDocument()
  })

  it('passe à l\'étape 1 après chargement de la session', async () => {
    global.fetch = mockSession()
    render(<PremiumBriefPage />)
    await waitForStep1()
    expect(screen.getByText('On commence par vous')).toBeInTheDocument()
    expect(screen.getByText(/Trois infos rapides/)).toBeInTheDocument()
  })

  it('affiche une erreur si la session est introuvable', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve({ error: 'Session introuvable' }),
    })
    render(<PremiumBriefPage />)
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('affiche la barre de progression et le label de l\'offre', async () => {
    global.fetch = mockSession(2)
    render(<PremiumBriefPage />)
    await waitForStep1()
    expect(screen.getByText(/JE CONFIE MON INTÉRIEUR/)).toBeInTheDocument()
    expect(screen.getByText(/Étape 1\/4/)).toBeInTheDocument()
  })
})

// ── Étape 1 ───────────────────────────────────────────────────────────────────

describe('PremiumBriefPage — étape 1 (Vous)', () => {
  beforeEach(async () => {
    global.fetch = mockSession()
    render(<PremiumBriefPage />)
    await waitForStep1()
  })

  it('affiche les champs requis', () => {
    expect(screen.getByPlaceholderText('Marie')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Je veux que mon salon/)).toBeInTheDocument()
  })

  it('affiche le champ téléphone en facultatif', () => {
    expect(screen.getByText(/facultatif/)).toBeInTheDocument()
  })

  it('"Continuer" est désactivé quand les champs requis sont vides', () => {
    expect(screen.getByRole('button', { name: /Continuer/ })).toBeDisabled()
  })

  it('"Continuer" reste désactivé si seulement le prénom est rempli', () => {
    fireEvent.change(screen.getByPlaceholderText('Marie'), { target: { value: 'Marie' } })
    expect(screen.getByRole('button', { name: /Continuer/ })).toBeDisabled()
  })

  it('"Continuer" s\'active quand prénom et projet sont remplis', () => {
    fillStep1()
    expect(screen.getByRole('button', { name: /Continuer/ })).not.toBeDisabled()
  })

  it('n\'affiche pas le bouton "Précédent" à l\'étape 1', () => {
    expect(screen.queryByRole('button', { name: /Précédent/ })).not.toBeInTheDocument()
  })
})

// ── Étape 2 — sans profil ─────────────────────────────────────────────────────

describe('PremiumBriefPage — étape 2 (style sans profil)', () => {
  beforeEach(async () => {
    global.fetch = mockSessionAndProfile(null)
    render(<PremiumBriefPage />)
    await goToStep2()
    await waitFor(() => {
      expect(screen.getByText('Ambiance recherchée')).toBeInTheDocument()
    })
  })

  it('affiche les questions de style sans profil', () => {
    expect(screen.getByText('Ambiance recherchée')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/J'adore le bleu nuit/)).toBeInTheDocument()
    expect(screen.getByText('Vos inspirations')).toBeInTheDocument()
  })

  it('affiche les chips d\'ambiance', () => {
    expect(screen.getByRole('button', { name: 'Cosy' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lumineux' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bohème' })).toBeInTheDocument()
  })

  it('"Continuer" est désactivé sans aucune saisie', () => {
    expect(screen.getByRole('button', { name: /Continuer/ })).toBeDisabled()
  })

  it('"Continuer" s\'active avec ambiance + couleurs + URL inspiration', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Cosy' }))
    fireEvent.change(screen.getByPlaceholderText(/J'adore le bleu nuit/), { target: { value: 'Bleu nuit' } })
    fireEvent.change(screen.getByPlaceholderText('https://pinterest.com/...'), { target: { value: 'https://pinterest.com/test' } })
    expect(screen.getByRole('button', { name: /Continuer/ })).not.toBeDisabled()
  })

  it('ne sélectionne pas plus de 3 ambiances', () => {
    const ambiances = ['Cosy', 'Lumineux', 'Apaisant', 'Élégant']
    ambiances.forEach(a => fireEvent.click(screen.getByRole('button', { name: a })))
    // La 4e ambiance remplace la 1re (sliding window)
    const selected = ambiances.filter(a => {
      const btn = screen.getByRole('button', { name: a })
      return btn.classList.contains('sel')
    })
    expect(selected.length).toBe(3)
  })

  it('affiche le bouton "Précédent" à l\'étape 2', () => {
    expect(screen.getByRole('button', { name: /Précédent/ })).toBeInTheDocument()
  })

  it('revient à l\'étape 1 en cliquant "Précédent"', () => {
    fireEvent.click(screen.getByRole('button', { name: /Précédent/ }))
    expect(screen.getByText('On commence par vous')).toBeInTheDocument()
  })

  it('affiche Étape 2 dans la barre de progression', () => {
    expect(screen.getByText(/Étape 2\/3/)).toBeInTheDocument()
  })
})

// ── Étape 2 — avec profil ─────────────────────────────────────────────────────

describe('PremiumBriefPage — étape 2 (style avec profil)', () => {
  const PROFILE = { style_name: 'Naturel affirmé', ambiance_cible: ['Cosy'], couleurs_aimees: ['Terracotta'] }

  beforeEach(async () => {
    global.fetch = mockSessionAndProfile(PROFILE)
    render(<PremiumBriefPage />)
    await goToStep2()
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('affiche l\'alerte KovaAlert avec le nom du profil', () => {
    expect(screen.getByRole('alert')).toHaveTextContent('Naturel affirmé')
  })

  it('affiche les deux boutons de confirmation', () => {
    expect(screen.getByRole('button', { name: /Oui, c'est moi/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Pas tout à fait/ })).toBeInTheDocument()
  })

  it('"Continuer" est désactivé avant toute sélection', () => {
    expect(screen.getByRole('button', { name: /Continuer/ })).toBeDisabled()
  })

  it('"Continuer" s\'active après "Oui, c\'est moi"', () => {
    fireEvent.click(screen.getByRole('button', { name: /Oui, c'est moi/ }))
    expect(screen.getByRole('button', { name: /Continuer/ })).not.toBeDisabled()
  })

  it('affiche le textarea de corrections quand "Pas tout à fait" est sélectionné', () => {
    fireEvent.click(screen.getByRole('button', { name: /Pas tout à fait/ }))
    expect(screen.getByPlaceholderText(/Soyez directe/)).toBeInTheDocument()
  })

  it('"Continuer" reste désactivé si corrections vides', () => {
    fireEvent.click(screen.getByRole('button', { name: /Pas tout à fait/ }))
    expect(screen.getByRole('button', { name: /Continuer/ })).toBeDisabled()
  })

  it('"Continuer" s\'active quand les corrections sont renseignées', () => {
    fireEvent.click(screen.getByRole('button', { name: /Pas tout à fait/ }))
    fireEvent.change(screen.getByPlaceholderText(/Soyez directe/), { target: { value: 'Mon goût a évolué.' } })
    expect(screen.getByRole('button', { name: /Continuer/ })).not.toBeDisabled()
  })
})

// ── Étape 3 — pièce ───────────────────────────────────────────────────────────

describe('PremiumBriefPage — étape 3 (pièces)', () => {
  async function goToStep3(roomsCount = 1) {
    global.fetch = mockSessionAndProfile(null, roomsCount)
    render(<PremiumBriefPage />)
    await goToStep2()
    await waitFor(() => expect(screen.getByText('Ambiance recherchée')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: 'Cosy' }))
    fireEvent.change(screen.getByPlaceholderText(/J'adore le bleu nuit/), { target: { value: 'Bleu nuit' } })
    fireEvent.change(screen.getByPlaceholderText('https://pinterest.com/...'), { target: { value: 'https://pinterest.com/test' } })

    fireEvent.click(screen.getByRole('button', { name: /Continuer/ }))
    await waitFor(() => expect(screen.getByText('Parlez-moi de cette pièce')).toBeInTheDocument())
  }

  it('affiche le badge "Pièce 1 sur 1" pour 1 pièce', async () => {
    await goToStep3(1)
    expect(screen.getByText('Pièce 1 sur 1')).toBeInTheDocument()
  })

  it('affiche le badge "Pièce 1 sur 3" pour 3 pièces', async () => {
    await goToStep3(3)
    expect(screen.getByText('Pièce 1 sur 3')).toBeInTheDocument()
  })

  it('affiche les chips de type de pièce', async () => {
    await goToStep3()
    expect(screen.getByRole('button', { name: 'Salon' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Chambre' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cuisine' })).toBeInTheDocument()
  })

  it('affiche les chips de budget', async () => {
    await goToStep3()
    expect(screen.getByRole('button', { name: '500–1000€' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Plus de 3500€' })).toBeInTheDocument()
  })

  it('affiche les boutons d\'approche', async () => {
    await goToStep3()
    expect(screen.getByRole('button', { name: /Améliorer l'existant/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Repartir de zéro/ })).toBeInTheDocument()
  })

  it('affiche le champ "garder" uniquement si approche = ameliorer', async () => {
    await goToStep3()
    expect(screen.queryByPlaceholderText(/le canapé gris/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Améliorer l'existant/ }))
    expect(screen.getByPlaceholderText(/le canapé gris/)).toBeInTheDocument()
  })

  it('"Envoyer mon brief" est désactivé initialement', async () => {
    await goToStep3(1)
    expect(screen.getByRole('button', { name: /Envoyer mon brief/ })).toBeDisabled()
  })

  it('affiche "Pièce suivante →" pour une session multi-pièces', async () => {
    await goToStep3(3)
    expect(screen.getByRole('button', { name: /Pièce suivante/ })).toBeInTheDocument()
  })

  it('affiche "Envoyer mon brief →" pour une session mono-pièce', async () => {
    await goToStep3(1)
    expect(screen.getByRole('button', { name: /Envoyer mon brief/ })).toBeInTheDocument()
  })

  it('"Précédent" revient à l\'étape 2 depuis la première pièce', async () => {
    await goToStep3()
    fireEvent.click(screen.getByRole('button', { name: /Précédent/ }))
    expect(screen.getByText('Votre style')).toBeInTheDocument()
  })

  it('affiche l\'indicateur de progression', async () => {
    await goToStep3(2)
    expect(screen.getByText(/Étape 3\/4/)).toBeInTheDocument()
  })
})
