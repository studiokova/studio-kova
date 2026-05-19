/**
 * @jest-environment node
 */

jest.mock('stripe', () => {
  const retrieve = jest.fn();
  const Ctor = jest.fn(() => ({ checkout: { sessions: { retrieve } } }));
  Ctor.__retrieve = retrieve;
  return Ctor;
});

jest.mock('@/lib/notion', () => ({ saveBrief: jest.fn() }));
jest.mock('@/lib/brevo', () => ({ addContactToList: jest.fn() }));

const { POST } = require('../route');
const Stripe = require('stripe');
const { saveBrief } = require('@/lib/notion');
const { addContactToList } = require('@/lib/brevo');

const BRIEF = {
  sessionId: 'cs_test_abc',
  pieces: 'Salon',
  photosLink: 'https://drive.google.com',
  style: 'Épuré',
  budget: '800–1200€',
};

const STRIPE_SESSION = {
  customer_details: { email: 'client@test.fr', name: 'Camille Laurent' },
  amount_total: 29900,
};

describe('POST /api/send-brief — orchestration complète', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
    process.env.BREVO_API_KEY = 'test-key';
    process.env.NOTIFICATION_EMAIL = 'hello@studiokova.fr';
    process.env.STRIPE_SECRET_KEY = 'sk_test_xxx';
    process.env.NOTION_DATABASE_ID = 'notion-db-id';
    process.env.NOTION_API_KEY = 'notion-key';
    process.env.BREVO_LIST_PREMIUM = '5';
    Stripe.__retrieve.mockResolvedValue(STRIPE_SESSION);
    saveBrief.mockResolvedValue(undefined);
    addContactToList.mockResolvedValue(undefined);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  function makeRequest(body) {
    return { json: async () => body };
  }

  function flush() {
    return new Promise((resolve) => setImmediate(resolve));
  }

  function emailCalls() {
    return global.fetch.mock.calls.filter(([url]) => url === 'https://api.brevo.com/v3/smtp/email');
  }

  describe('récupération Stripe', () => {
    it('appelle stripe.checkout.sessions.retrieve avec le sessionId', async () => {
      await POST(makeRequest(BRIEF));
      expect(Stripe.__retrieve).toHaveBeenCalledWith('cs_test_abc');
    });

    it('continue sans erreur si Stripe échoue', async () => {
      Stripe.__retrieve.mockRejectedValue(new Error('Stripe error'));
      const res = await POST(makeRequest(BRIEF));
      expect(res.status).toBe(200);
      expect(console.error).toHaveBeenCalledWith('Stripe retrieve error:', 'Stripe error');
    });

    it('ne tente pas de récupérer Stripe si sessionId absent', async () => {
      const { sessionId: _ignored, ...brief } = BRIEF;
      await POST(makeRequest(brief));
      expect(Stripe.__retrieve).not.toHaveBeenCalled();
    });
  });

  describe('sauvegarde Notion', () => {
    it('appelle saveBrief avec les données Stripe et du formulaire', async () => {
      await POST(makeRequest(BRIEF));
      await flush();
      expect(saveBrief).toHaveBeenCalledWith({
        nom: 'Camille Laurent',
        email: 'client@test.fr',
        montant: 299,
        sessionId: 'cs_test_abc',
        pieces: 'Salon',
        photosLink: 'https://drive.google.com',
        style: 'Épuré',
        budget: '800–1200€',
      });
    });

    it('ne bloque pas l\'envoi email si Notion échoue', async () => {
      saveBrief.mockRejectedValue(new Error('Notion error'));
      const res = await POST(makeRequest(BRIEF));
      expect(res.status).toBe(200);
      await flush();
      expect(console.error).toHaveBeenCalledWith('Notion save error:', 'Notion error');
    });
  });

  describe('ajout contact Brevo', () => {
    it('appelle addContactToList avec email Stripe et listId premium', async () => {
      await POST(makeRequest(BRIEF));
      await flush();
      expect(addContactToList).toHaveBeenCalledWith(
        'client@test.fr',
        '5',
        { PRENOM: 'Camille Laurent' }
      );
    });

    it('ne bloque pas l\'envoi email si Brevo contact échoue', async () => {
      addContactToList.mockRejectedValue(new Error('Brevo error'));
      const res = await POST(makeRequest(BRIEF));
      expect(res.status).toBe(200);
      await flush();
      expect(console.error).toHaveBeenCalledWith('Brevo contact error:', 'Brevo error');
    });
  });

  describe('email client', () => {
    it('envoie un email au client si Stripe a retourné un email', async () => {
      await POST(makeRequest(BRIEF));
      const clientCall = emailCalls().find(([, opts]) => JSON.parse(opts.body).to[0].email === 'client@test.fr');
      expect(clientCall).toBeDefined();
      const body = JSON.parse(clientCall[1].body);
      expect(body.subject).toBe('Votre projet Studio Kova est lancé ✓');
    });

    it('inclut les pièces et le budget dans l\'email client', async () => {
      await POST(makeRequest(BRIEF));
      const clientCall = emailCalls().find(([, opts]) => JSON.parse(opts.body).to[0].email === 'client@test.fr');
      const body = JSON.parse(clientCall[1].body);
      expect(body.htmlContent).toContain('Salon');
      expect(body.htmlContent).toContain('800–1200€');
    });

    it('contient le message "Je reviens vers vous sous 24h"', async () => {
      await POST(makeRequest(BRIEF));
      const clientCall = emailCalls().find(([, opts]) => JSON.parse(opts.body).to[0].email === 'client@test.fr');
      const body = JSON.parse(clientCall[1].body);
      expect(body.htmlContent).toContain('Je reviens vers vous sous 24h');
    });

    it('ne tente pas d\'envoyer l\'email client si Stripe n\'a pas retourné d\'email', async () => {
      Stripe.__retrieve.mockResolvedValue({ customer_details: { email: '', name: '' }, amount_total: 0 });
      await POST(makeRequest(BRIEF));
      expect(emailCalls().length).toBe(1);
    });
  });

  describe('email interne', () => {
    it('envoie toujours un email interne à NOTIFICATION_EMAIL', async () => {
      await POST(makeRequest(BRIEF));
      const internalCall = emailCalls().find(([, opts]) => JSON.parse(opts.body).to[0].email === 'hello@studiokova.fr');
      expect(internalCall).toBeDefined();
    });

    it('le sujet contient les pièces et le budget', async () => {
      await POST(makeRequest(BRIEF));
      const internalCall = emailCalls().find(([, opts]) => JSON.parse(opts.body).to[0].email === 'hello@studiokova.fr');
      const body = JSON.parse(internalCall[1].body);
      expect(body.subject).toContain('Salon');
      expect(body.subject).toContain('800–1200€');
    });

    it('inclut nom, email, sessionId et les champs du formulaire', async () => {
      await POST(makeRequest(BRIEF));
      const internalCall = emailCalls().find(([, opts]) => JSON.parse(opts.body).to[0].email === 'hello@studiokova.fr');
      const body = JSON.parse(internalCall[1].body);
      expect(body.htmlContent).toContain('Camille Laurent');
      expect(body.htmlContent).toContain('client@test.fr');
      expect(body.htmlContent).toContain('cs_test_abc');
      expect(body.htmlContent).toContain('Salon');
      expect(body.htmlContent).toContain('Épuré');
    });

    it('est envoyé même si Stripe échoue', async () => {
      Stripe.__retrieve.mockRejectedValue(new Error('Stripe error'));
      await POST(makeRequest(BRIEF));
      const internalCall = emailCalls().find(([, opts]) => JSON.parse(opts.body).to[0].email === 'hello@studiokova.fr');
      expect(internalCall).toBeDefined();
    });
  });

  describe('réponse', () => {
    it('retourne { success: true } si tout réussit', async () => {
      const res = await POST(makeRequest(BRIEF));
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });

    it('retourne { error } status 500 si l\'envoi email échoue', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Brevo error' }),
      });
      const res = await POST(makeRequest(BRIEF));
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it('log l\'erreur côté serveur si l\'envoi email échoue', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Brevo error' }),
      });
      await POST(makeRequest(BRIEF));
      expect(console.error).toHaveBeenCalledWith('Email send error:', expect.any(String));
    });
  });
});
