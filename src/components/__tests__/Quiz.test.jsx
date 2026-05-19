import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Quiz from '../Quiz';

beforeAll(() => {
  delete window.location;
  window.location = { href: 'http://localhost/' };
  window.history.back = jest.fn();
});

// Profil attendu avec ces réponses : "Scandinave chaleureux"
// Q1=Les couleurs → sature:2
// Q2=A (Naturel & lumière) → chaud:4, epure:4, neutre_col:4
// Q3=Tons naturels → chaud:2, neutre_col:2
// → chaud|epure|neutre
function remplirEtSoumettre() {
  // Q1 — attrait principal
  fireEvent.click(screen.getByText('Les couleurs'));
  fireEvent.click(screen.getByText('Suivant →'));

  // Q2 — photos ambiances (div avec onClick)
  fireEvent.click(screen.getByText('Naturel & lumière'));
  fireEvent.click(screen.getByText('Suivant →'));

  // Q3 — palette
  fireEvent.click(screen.getByText('Tons naturels (lin, rotin, sable)'));
  fireEvent.click(screen.getByText('Suivant →'));

  // Q4 — pièce problématique
  fireEvent.click(screen.getByText('Salon'));
  fireEvent.click(screen.getByText('Suivant →'));

  // Q5 — blocage
  fireEvent.click(screen.getByText('Je ne sais pas par où commencer'));
  fireEvent.click(screen.getByText('Suivant →'));

  // Q6 — budget (déclenche setPhase("loading"))
  fireEvent.click(screen.getByText('Entre 500€ et 1 500€'));
  fireEvent.click(screen.getByText('Voir mon profil →'));
}

describe('Quiz — navigation et questions', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    act(() => { jest.runOnlyPendingTimers(); });
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('affiche la première question au chargement', () => {
    render(<Quiz />);
    expect(screen.getByText(/Étape 1\/6/)).toBeInTheDocument();
    expect(screen.getByText(/qu'est-ce qui vous attire en premier/)).toBeInTheDocument();
  });

  it('affiche la barre de progression', () => {
    const { container } = render(<Quiz />);
    expect(container.querySelector('.ks-bar')).toBeInTheDocument();
    expect(container.querySelector('.ks-segment')).toBeInTheDocument();
  });

  it('le bouton Suivant est désactivé sans réponse à Q1', () => {
    render(<Quiz />);
    expect(screen.getByText('Suivant →')).toBeDisabled();
  });

  it('le bouton Suivant est activé après une réponse à Q1', () => {
    render(<Quiz />);
    fireEvent.click(screen.getByText('Les couleurs'));
    expect(screen.getByText('Suivant →')).not.toBeDisabled();
  });

  it('la progression avance après Suivant (step 1 → 2)', () => {
    const { container } = render(<Quiz />);
    fireEvent.click(screen.getByText('Les couleurs'));

    const doneBefore = container.querySelectorAll('.ks-segment.done').length;
    fireEvent.click(screen.getByText('Suivant →'));
    const doneAfter = container.querySelectorAll('.ks-segment.done').length;

    expect(doneAfter).toBeGreaterThan(doneBefore);
  });

  it('le bouton retour est présent sur le quiz', () => {
    render(<Quiz />);
    expect(screen.getByText(/Accueil/)).toBeInTheDocument();
  });

  it('toutes les options Q1 sont présentes', () => {
    render(<Quiz />);
    const options = [
      'Les couleurs',
      'La lumière naturelle',
      "L'organisation et la clarté",
      'Les matières et textures',
      'Les objets et la déco personnelle',
    ];
    options.forEach(opt => {
      expect(screen.getByText(opt)).toBeInTheDocument();
    });
  });

  it('Q2 — permet de sélectionner jusqu\'à 2 ambiances', () => {
    render(<Quiz />);
    fireEvent.click(screen.getByText('Les couleurs'));
    fireEvent.click(screen.getByText('Suivant →'));

    fireEvent.click(screen.getByText('Naturel & lumière'));
    fireEvent.click(screen.getByText('Épuré contemporain'));

    expect(screen.getByText('Suivant →')).not.toBeDisabled();
  });

  it('Q6 — le bouton final s\'appelle "Voir mon profil →"', () => {
    render(<Quiz />);
    fireEvent.click(screen.getByText('Les couleurs'));
    fireEvent.click(screen.getByText('Suivant →'));
    fireEvent.click(screen.getByText('Naturel & lumière'));
    fireEvent.click(screen.getByText('Suivant →'));
    fireEvent.click(screen.getByText('Tons naturels (lin, rotin, sable)'));
    fireEvent.click(screen.getByText('Suivant →'));
    fireEvent.click(screen.getByText('Salon'));
    fireEvent.click(screen.getByText('Suivant →'));
    fireEvent.click(screen.getByText('Je ne sais pas par où commencer'));
    fireEvent.click(screen.getByText('Suivant →'));

    expect(screen.getByText('Voir mon profil →')).toBeInTheDocument();
  });
});

describe('Quiz — phase loading et résultat', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    act(() => { jest.runOnlyPendingTimers(); });
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('affiche la phase loading après le dernier Suivant', () => {
    render(<Quiz />);
    remplirEtSoumettre();
    expect(screen.getByText(/On prépare votre profil/)).toBeInTheDocument();
  });

  it('affiche le profil après 2 secondes de loading', async () => {
    render(<Quiz />);
    remplirEtSoumettre();

    act(() => { jest.advanceTimersByTime(2100); });

    await waitFor(() => {
      expect(screen.getByText('Scandinave chaleureux')).toBeInTheDocument();
    });
  });

  it('affiche le formulaire email dans les résultats', async () => {
    render(<Quiz />);
    remplirEtSoumettre();
    act(() => { jest.advanceTimersByTime(2100); });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('votre@email.fr')).toBeInTheDocument();
    });
  });

  it('affiche le bouton CTA dans les résultats', async () => {
    render(<Quiz />);
    remplirEtSoumettre();
    act(() => { jest.advanceTimersByTime(2100); });

    await waitFor(() => {
      // budget 500-1500€ → CTA /surmesure
      expect(screen.getByRole('link', { name: /Je vous confie mon intérieur/ })).toBeInTheDocument();
    });
  });
});

describe('Quiz — capture email', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    act(() => { jest.runOnlyPendingTimers(); });
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  async function allerAuResultat() {
    render(<Quiz />);
    remplirEtSoumettre();
    act(() => { jest.advanceTimersByTime(2100); });
    await waitFor(() => screen.getByPlaceholderText('votre@email.fr'));
  }

  it("soumet l'email avec succès et affiche la confirmation", async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // /api/profile

    await allerAuResultat();

    const emailInput = screen.getByPlaceholderText('votre@email.fr');
    fireEvent.change(emailInput, { target: { value: 'test@example.fr' } });

    await act(async () => {
      fireEvent.click(screen.getByText("Recevoir mon profil →"));
    });

    await waitFor(() => {
      expect(screen.getByText(/C'est noté/)).toBeInTheDocument();
    });
  });

  it("affiche une erreur si l'envoi échoue", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false }),
    });

    await allerAuResultat();

    const emailInput = screen.getByPlaceholderText('votre@email.fr');
    fireEvent.change(emailInput, { target: { value: 'test@example.fr' } });

    await act(async () => {
      fireEvent.click(screen.getByText("Recevoir mon profil →"));
    });

    await waitFor(() => {
      expect(screen.getByText(/Une erreur s'est produite/)).toBeInTheDocument();
    });
  });

  it("n'envoie pas si l'email est invalide (sans @)", async () => {
    await allerAuResultat();

    const emailInput = screen.getByPlaceholderText('votre@email.fr');
    fireEvent.change(emailInput, { target: { value: 'invalide' } });
    fireEvent.click(screen.getByText("Recevoir mon profil →"));

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
