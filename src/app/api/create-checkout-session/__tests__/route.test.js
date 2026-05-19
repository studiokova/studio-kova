/**
 * @jest-environment node
 */

const mockSessionCreate = jest.fn();

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: mockSessionCreate,
      },
    },
  }));
});

const { POST } = require('../route');

function makeRequest(body) {
  return new Request('http://localhost/api/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/create-checkout-session', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key';
    process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';

    mockSessionCreate.mockResolvedValue({
      url: 'https://checkout.stripe.com/c/pay/session_test',
    });
  });

  // ─── Calcul des montants ────────────────────────────────────────────────

  it('1 pièce → 29 900 centimes', async () => {
    await POST(makeRequest({ rooms: 1 }));

    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [
          expect.objectContaining({
            price_data: expect.objectContaining({ unit_amount: 29900 }),
          }),
        ],
      })
    );
  });

  it('2 pièces → 52 900 centimes', async () => {
    await POST(makeRequest({ rooms: 2 }));

    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [
          expect.objectContaining({
            price_data: expect.objectContaining({ unit_amount: 52900 }),
          }),
        ],
      })
    );
  });

  it('3 pièces → 75 900 centimes', async () => {
    await POST(makeRequest({ rooms: 3 }));

    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [
          expect.objectContaining({
            price_data: expect.objectContaining({ unit_amount: 75900 }),
          }),
        ],
      })
    );
  });

  it('10 pièces → calcul correct (299 + 9×230 = 2 369 → 236 900 centimes)', async () => {
    await POST(makeRequest({ rooms: 10 }));

    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [
          expect.objectContaining({
            price_data: expect.objectContaining({ unit_amount: 236900 }),
          }),
        ],
      })
    );
  });

  // ─── Réponse de succès ─────────────────────────────────────────────────

  it('retourne 200 avec l\'URL de la session Stripe', async () => {
    const res = await POST(makeRequest({ rooms: 1 }));

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url).toBe('https://checkout.stripe.com/c/pay/session_test');
  });

  it('inclut le nombre de pièces dans les metadata Stripe', async () => {
    await POST(makeRequest({ rooms: 3 }));

    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ rooms: '3' }),
      })
    );
  });

  // ─── Validation des paramètres → 400 ──────────────────────────────────

  it('rooms manquant → 400', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it('rooms = 0 → 400', async () => {
    const res = await POST(makeRequest({ rooms: 0 }));
    expect(res.status).toBe(400);
  });

  it('rooms = 11 (> 10) → 400', async () => {
    const res = await POST(makeRequest({ rooms: 11 }));
    expect(res.status).toBe(400);
  });

  it('rooms = -1 → 400', async () => {
    const res = await POST(makeRequest({ rooms: -1 }));
    expect(res.status).toBe(400);
  });

  it('corps JSON invalide → 400', async () => {
    const req = new Request('http://localhost/api/create-checkout-session', {
      method: 'POST',
      body: 'pas du json{{{',
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  // ─── Erreur Stripe → 500 ──────────────────────────────────────────────

  it('erreur Stripe → 500 avec message d\'erreur', async () => {
    mockSessionCreate.mockRejectedValueOnce(new Error('Stripe unavailable'));

    const res = await POST(makeRequest({ rooms: 1 }));

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  // ─── URL de retour ─────────────────────────────────────────────────────

  it('success_url pointe vers /premium/brief', async () => {
    await POST(makeRequest({ rooms: 1 }));

    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: expect.stringContaining('/premium/brief'),
      })
    );
  });

  it('cancel_url pointe vers /offre-premium', async () => {
    await POST(makeRequest({ rooms: 1 }));

    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        cancel_url: expect.stringContaining('/offre-premium'),
      })
    );
  });
});
