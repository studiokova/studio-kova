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
function remplirQuiz() {
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

  // Q6 — déclenche setPhase("gate")
  fireEvent.click(screen.getByText('Entre 500€ et 1 500€'));
  fireEvent.click(screen.getByText('Voir mon profil →'));
}

async function soumettreGate(emailValue = 'test@example.fr') {
  const input = screen.getByPlaceholderText('votre@email.fr');
  fireEvent.change(input, { target: { value: emailValue } });
  await act(async () => {
    fireEvent.click(screen.getByText('Recevoir ma palette →'));
  });
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

  it('le label de l\'offre est présent sur le quiz', () => {
    render(<Quiz />);
    expect(screen.getByText(/JE TROUVE MON STYLE/i)).toBeInTheDocument();
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

describe('Quiz — email gate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    act(() => { jest.runOnlyPendingTimers(); });
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('affiche le gate avec l\'aperçu du profil après Q6', () => {
    render(<Quiz />);
    remplirQuiz();
    // Le nom de profil calculé est visible
    expect(screen.getByText('Scandinave chaleureux')).toBeInTheDocument();
    // Le formulaire email est présent
    expect(screen.getByPlaceholderText('votre@email.fr')).toBeInTheDocument();
    expect(screen.getByText('Recevoir ma palette →')).toBeInTheDocument();
  });

  it('affiche les axes et la palette dans l\'aperçu', () => {
    render(<Quiz />);
    remplirQuiz();
    expect(screen.getByText(/Doux · Épuré · Naturel/)).toBeInTheDocument();
  });

  it('affiche une erreur si l\'email est invalide', () => {
    render(<Quiz />);
    remplirQuiz();

    const input = screen.getByPlaceholderText('votre@email.fr');
    fireEvent.change(input, { target: { value: 'invalide' } });
    fireEvent.click(screen.getByText('Recevoir ma palette →'));

    expect(screen.getByText(/Adresse email invalide/)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('n\'envoie pas si l\'email est vide', () => {
    render(<Quiz />);
    remplirQuiz();
    fireEvent.click(screen.getByText('Recevoir ma palette →'));

    expect(screen.getByText(/Adresse email invalide/)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('efface l\'erreur quand l\'utilisateur retape', () => {
    render(<Quiz />);
    remplirQuiz();

    fireEvent.click(screen.getByText('Recevoir ma palette →'));
    expect(screen.getByText(/Adresse email invalide/)).toBeInTheDocument();

    const input = screen.getByPlaceholderText('votre@email.fr');
    fireEvent.change(input, { target: { value: 'a' } });
    expect(screen.queryByText(/Adresse email invalide/)).not.toBeInTheDocument();
  });
});

describe('Quiz — résultat', () => {
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
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(<Quiz />);
    remplirQuiz();
    await soumettreGate();
    await waitFor(() => screen.getByText('Vos 3 premières actions'));
  }

  it('affiche le profil complet immédiatement après le gate', async () => {
    await allerAuResultat();
    expect(screen.getByText('Scandinave chaleureux')).toBeInTheDocument();
    expect(screen.getByText(/Doux · Épuré · Naturel/)).toBeInTheDocument();
  });

  it('affiche la section actions', async () => {
    await allerAuResultat();
    expect(screen.getByText('Vos 3 premières actions')).toBeInTheDocument();
  });

  it('affiche le bouton CTA avec le bon libellé', async () => {
    await allerAuResultat();
    // budget 500-1500€ → CTA /surmesure
    expect(screen.getByRole('link', { name: /Je vous confie mon intérieur/ })).toBeInTheDocument();
  });

  it('n\'affiche pas de formulaire email dans la page résultat', async () => {
    await allerAuResultat();
    // L'input email du gate a disparu
    expect(screen.queryByPlaceholderText('votre@email.fr')).not.toBeInTheDocument();
  });
});

describe('Quiz — soumission email via gate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    act(() => { jest.runOnlyPendingTimers(); });
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('appelle /api/subscribe lors de la soumission du gate', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(<Quiz />);
    remplirQuiz();
    await soumettreGate('contact@test.fr');

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/subscribe',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('envoie le profil calculé avec l\'email', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(<Quiz />);
    remplirQuiz();
    await soumettreGate('contact@test.fr');

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.email).toBe('contact@test.fr');
    expect(body.attributes.PROFIL).toBe('Scandinave chaleureux');
  });
});
