import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ConfirmationContent from '../ConfirmationContent';

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key) => (key === 'session_id' ? 'cs_test_abc123' : null),
  }),
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/offre-premium/confirmation',
}));

beforeAll(() => {
  window.scrollTo = jest.fn();
});

function goToStep(n) {
  if (n >= 2) {
    fireEvent.change(screen.getByLabelText(/Pièce\(s\) concernée\(s\)/), { target: { value: 'Salon' } });
    fireEvent.click(screen.getByRole('button', { name: /Continuer/ }));
  }
  if (n >= 3) {
    fireEvent.change(screen.getByLabelText(/Décrivez votre style/), { target: { value: 'Épuré et chaleureux' } });
    fireEvent.click(screen.getByRole('button', { name: /Continuer/ }));
  }
  if (n >= 4) {
    fireEvent.change(screen.getByLabelText(/Budget pour les meubles/), { target: { value: '800€' } });
    fireEvent.click(screen.getByRole('button', { name: /Continuer/ }));
  }
}

describe('ConfirmationContent — structure', () => {
  it('se rend sans erreur', () => {
    render(<ConfirmationContent />);
  });

  it('affiche la navigation et le footer', () => {
    render(<ConfirmationContent />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it("affiche le label de l'offre et l'etape courante", () => {
    render(<ConfirmationContent />);
    expect(screen.getByText(/JE VOUS CONFIE MON INTÉRIEUR/)).toBeInTheDocument();
    expect(screen.getByText(/Étape 1\/4/)).toBeInTheDocument();
  });
});

describe("ConfirmationContent — etape 1 (Vos photos)", () => {
  it("affiche le titre et les champs de l'etape 1", () => {
    render(<ConfirmationContent />);
    expect(screen.getByText(/Montrez-moi votre pièce/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pièce\(s\) concernée\(s\)/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lien vers vos photos/)).toBeInTheDocument();
  });

  it('"Continuer" est desactive tant que pieces est vide', () => {
    render(<ConfirmationContent />);
    expect(screen.getByRole('button', { name: /Continuer/ })).toBeDisabled();
  });

  it('"Continuer" s\'active quand pieces est renseigne', () => {
    render(<ConfirmationContent />);
    fireEvent.change(screen.getByLabelText(/Pièce\(s\) concernée\(s\)/), { target: { value: 'Salon' } });
    expect(screen.getByRole('button', { name: /Continuer/ })).not.toBeDisabled();
  });
});

describe("ConfirmationContent — etape 2 (Votre style)", () => {
  it("passe a l'etape 2 et affiche le bon titre", () => {
    render(<ConfirmationContent />);
    goToStep(2);
    expect(screen.getByText(/Votre style en une phrase/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Décrivez votre style/)).toBeInTheDocument();
    expect(screen.getByText(/Étape 2\/4/)).toBeInTheDocument();
  });

  it('"Precedent" est affiche a partir de l\'etape 2', () => {
    render(<ConfirmationContent />);
    goToStep(2);
    expect(screen.getByRole('button', { name: /Précédent/ })).toBeInTheDocument();
  });

  it('"Continuer" est desactive si style est vide', () => {
    render(<ConfirmationContent />);
    goToStep(2);
    expect(screen.getByRole('button', { name: /Continuer/ })).toBeDisabled();
  });
});

describe("ConfirmationContent — etape 3 (Votre budget)", () => {
  it("passe a l'etape 3 et affiche le bon titre", () => {
    render(<ConfirmationContent />);
    goToStep(3);
    expect(screen.getByText(/Parlons budget/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Budget pour les meubles/)).toBeInTheDocument();
    expect(screen.getByText(/Étape 3\/4/)).toBeInTheDocument();
  });
});

describe("ConfirmationContent — etape 4 (Confirmation)", () => {
  it("affiche le recap et le bouton d'envoi", () => {
    render(<ConfirmationContent />);
    goToStep(4);
    expect(screen.getByText(/Dernière étape/)).toBeInTheDocument();
    expect(screen.getByText('Salon')).toBeInTheDocument();
    expect(screen.getByText('Épuré et chaleureux')).toBeInTheDocument();
    expect(screen.getByText('800€')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Envoyer mon brief/ })).toBeInTheDocument();
  });
});

describe('ConfirmationContent — soumission', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('soumet le brief et affiche la confirmation de succes', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });

    render(<ConfirmationContent />);
    goToStep(4);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Envoyer mon brief/ }));
    });

    await waitFor(() => {
      expect(screen.getByText(/est confirmée/)).toBeInTheDocument();
      expect(screen.getByText(/Votre brief a bien été envoyé/)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/send-brief',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('cs_test_abc123'),
      })
    );
  });

  it('affiche une erreur si la soumission echoue', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });

    render(<ConfirmationContent />);
    goToStep(4);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Envoyer mon brief/ }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Une erreur.*produite/)).toBeInTheDocument();
    });
  });

  it('affiche "Envoi..." pendant la soumission', async () => {
    global.fetch.mockImplementation(() => new Promise(() => {}));

    render(<ConfirmationContent />);
    goToStep(4);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Envoyer mon brief/ }));
    });

    expect(screen.getByText('Envoi…')).toBeInTheDocument();
  });
});
