import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import PriceCalculator from '../PriceCalculator';

beforeAll(() => {
  delete window.location;
  window.location = { href: '' };
  process.env.NEXT_PUBLIC_CONTACT_EMAIL = 'hello@studiokova.fr';
});

describe('PriceCalculator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    window.location.href = '';
  });

  it('se rend sans erreur', () => {
    render(<PriceCalculator />);
    expect(screen.getByText(/Total estim/)).toBeInTheDocument();
  });

  it('affiche 10 boutons de selection de pieces', () => {
    render(<PriceCalculator />);
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it('selectionne 1 piece par defaut', () => {
    render(<PriceCalculator />);
    const btn1 = screen.getByText('1');
    expect(btn1).toHaveClass('kova-price-calc__btn--active');
  });

  it('affiche le prix pour 1 piece (299)', () => {
    render(<PriceCalculator />);
    // Multiple elements contain "299" (subtitle + total span)
    const totalEls = screen.getAllByText(/299/);
    expect(totalEls.length).toBeGreaterThan(0);
  });

  it('affiche le prix correct pour 3 pieces (759)', () => {
    render(<PriceCalculator />);
    fireEvent.click(screen.getByText('3'));
    const totalEl = screen.getAllByText(/759/);
    expect(totalEl.length).toBeGreaterThan(0);
  });

  it('affiche le prix correct pour 2 pieces (529)', () => {
    render(<PriceCalculator />);
    fireEvent.click(screen.getByText('2'));
    const totalEl = screen.getAllByText(/529/);
    expect(totalEl.length).toBeGreaterThan(0);
  });

  it("n'affiche pas la classe --visible sur saving pour 1 piece", () => {
    const { container } = render(<PriceCalculator />);
    expect(container.querySelector('.kova-price-calc__saving')).not.toHaveClass('kova-price-calc__saving--visible');
  });

  it('affiche la classe --visible sur saving pour 2 pieces', () => {
    const { container } = render(<PriceCalculator />);
    fireEvent.click(screen.getByText('2'));
    expect(container.querySelector('.kova-price-calc__saving')).toHaveClass('kova-price-calc__saving--visible');
  });

  it('affiche le bouton Commander avec le bon texte (1 piece)', () => {
    render(<PriceCalculator />);
    expect(screen.getByRole('button', { name: /Démarrer mon projet/ })).toBeInTheDocument();
  });

  it('appelle /api/create-checkout-session avec le bon body', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: 'https://checkout.stripe.com/pay' }),
    });

    render(<PriceCalculator />);
    fireEvent.click(screen.getByText('3'));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Démarrer mon projet/ }));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/create-checkout-session',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ rooms: 3 }),
      })
    );
  });

  it('affiche "Redirection..." pendant la requete', async () => {
    global.fetch.mockImplementation(() => new Promise(() => {}));

    render(<PriceCalculator />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Démarrer mon projet/ }));
    });

    expect(screen.getByText('Redirection...')).toBeInTheDocument();
  });

  it("redirige vers l'URL Stripe en cas de succes", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: 'https://checkout.stripe.com/pay/abc123' }),
    });

    render(<PriceCalculator />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Démarrer mon projet/ }));
    });

    await waitFor(() => {
      expect(window.location.href).toBe('https://checkout.stripe.com/pay/abc123');
    });
  });

  it("affiche un message d'erreur si l'API repond avec une erreur", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Erreur de paiement.' }),
    });

    render(<PriceCalculator />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Démarrer mon projet/ }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Erreur de paiement/)).toBeInTheDocument();
    });
  });

  it("affiche un message d'erreur si le reseau echoue", async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<PriceCalculator />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Démarrer mon projet/ }));
    });

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});
