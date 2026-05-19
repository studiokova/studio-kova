/**
 * @jest-environment node
 */

jest.mock('stripe', () => {
  const retrieve = jest.fn();
  const Ctor = jest.fn(() => ({ checkout: { sessions: { retrieve } } }));
  Ctor.__retrieve = retrieve;
  return Ctor;
});

jest.mock('@/lib/notion', () => ({ saveBrief: jest.fn().mockResolvedValue(undefined) }));
jest.mock('@/lib/brevo', () => ({ addContactToList: jest.fn().mockResolvedValue(undefined) }));

const { POST } = require('../route');
const Stripe = require('stripe');

describe('POST /api/send-brief', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
    process.env.BREVO_API_KEY = 'test-brevo-key';
    process.env.NOTIFICATION_EMAIL = 'hello@studiokova.fr';
    process.env.STRIPE_SECRET_KEY = 'sk_test_xxx';
    process.env.BREVO_LIST_PREMIUM = '5';
    Stripe.__retrieve.mockResolvedValue({
      customer_details: { email: 'client@test.fr', name: 'Test Client' },
      amount_total: 29900,
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  function makeRequest(body) {
    return { json: async () => body };
  }

  it('retourne 400 si pieces manquant', async () => {
    const res = await POST(makeRequest({ style: 'Épuré', budget: '500€' }));
    expect(res.status).toBe(400);
  });

  it('retourne 400 si style manquant', async () => {
    const res = await POST(makeRequest({ pieces: 'Salon', budget: '500€' }));
    expect(res.status).toBe(400);
  });

  it('retourne 400 si budget manquant', async () => {
    const res = await POST(makeRequest({ pieces: 'Salon', style: 'Épuré' }));
    expect(res.status).toBe(400);
  });

  it('retourne 200 et { success: true } si les emails sont envoyés', async () => {
    const res = await POST(makeRequest({ pieces: 'Salon', style: 'Épuré', budget: '500€', sessionId: 'cs_test_abc' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it('retourne 500 si Brevo répond avec erreur', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Brevo error' }),
    });
    const res = await POST(makeRequest({ pieces: 'Salon', style: 'Épuré', budget: '500€' }));
    expect(res.status).toBe(500);
  });

  it('retourne 500 si le réseau échoue', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));
    const res = await POST(makeRequest({ pieces: 'Salon', style: 'Épuré', budget: '500€' }));
    expect(res.status).toBe(500);
  });

  it('inclut sessionId dans l\'email interne', async () => {
    await POST(makeRequest({ pieces: 'Salon', style: 'Épuré', budget: '500€', sessionId: 'cs_test_abc' }));
    const brevoCall = global.fetch.mock.calls.find(([url]) => url === 'https://api.brevo.com/v3/smtp/email');
    const body = JSON.parse(brevoCall[1].body);
    expect(body.htmlContent).toContain('cs_test_abc');
  });

  it('appelle Brevo email avec le bon endpoint et la bonne méthode', async () => {
    await POST(makeRequest({ pieces: 'Salon', style: 'Épuré', budget: '500€' }));
    const brevoEmailCalls = global.fetch.mock.calls.filter(([url]) => url === 'https://api.brevo.com/v3/smtp/email');
    expect(brevoEmailCalls.length).toBeGreaterThan(0);
    expect(brevoEmailCalls[0][1]).toMatchObject({ method: 'POST' });
  });
});
