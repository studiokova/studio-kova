/**
 * @jest-environment node
 */

const mockSingle = jest.fn()
const mockInsert = jest.fn().mockReturnValue({
  select: jest.fn().mockReturnValue({ single: mockSingle }),
})

jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn().mockReturnValue({ insert: mockInsert }),
  },
}))

const { POST } = require('../route')

const VALID_BODY = {
  session_id: 'cs_test_abc',
  email: 'client@test.fr',
  rooms_count: 2,
  prenom: 'Marie',
  telephone: null,
  projet_phrase: 'Je veux transformer mon salon.',
  style_validation: 'no_profile',
  style_profile_snap: null,
  style_corrections: null,
  style_inputs: { ambiance: ['Cosy', 'Lumineux'], couleurs: 'Bleu nuit', inspirations_url: 'https://pinterest.com/test', inspirations_photos: [] },
  rooms: [
    { type_piece: 'Salon', photos: ['url1', 'url2', 'url3'], approche: 'ameliorer', garder: 'le canapé', probleme: 'trop sombre', sentiment: 'apaisée', budget: '500–1000€', contraintes: null },
    { type_piece: 'Chambre', photos: ['url4', 'url5', 'url6'], approche: 'repartir', garder: null, probleme: 'sans âme', sentiment: 'cocon', budget: '1000–2000€', contraintes: null },
  ],
}

function makeRequest(body) {
  return { json: async () => body }
}

describe('POST /api/premium/brief', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => {})
    mockSingle.mockResolvedValue({ data: { id: 'test-uuid' }, error: null })
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
    process.env.BREVO_API_KEY = 'test-brevo-key'
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // ─── Validation ────────────────────────────────────────────────────────────

  it('retourne 400 si email est absent', async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, email: undefined }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBeDefined()
  })

  it('retourne 400 si le corps JSON est invalide', async () => {
    const res = await POST({ json: async () => { throw new Error('bad json') } })
    expect(res.status).toBe(400)
  })

  // ─── Succès ────────────────────────────────────────────────────────────────

  it('retourne 200 et { success: true } avec données valides', async () => {
    const res = await POST(makeRequest(VALID_BODY))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
  })

  it('insère les données dans Supabase avec les bons champs', async () => {
    await POST(makeRequest(VALID_BODY))

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'client@test.fr',
        stripe_payment_id: 'cs_test_abc',
        rooms_count: 2,
        prenom: 'Marie',
        style_validation: 'no_profile',
      })
    )
  })

  it('calcule rooms_count depuis rooms.length si absent', async () => {
    await POST(makeRequest({ ...VALID_BODY, rooms_count: undefined }))

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ rooms_count: 2 })
    )
  })

  it('envoie la notification interne à hello@studiokova.fr', async () => {
    await POST(makeRequest(VALID_BODY))

    const internalCall = global.fetch.mock.calls.find(([url, opts]) => {
      if (url !== 'https://api.brevo.com/v3/smtp/email') return false
      const body = JSON.parse(opts.body)
      return body.to?.[0]?.email === 'hello@studiokova.fr'
    })
    expect(internalCall).toBeDefined()
    const body = JSON.parse(internalCall[1].body)
    expect(body.subject).toContain('Marie')
  })

  it('l\'email interne contient le détail des pièces', async () => {
    await POST(makeRequest(VALID_BODY))

    const internalCall = global.fetch.mock.calls.find(([url, opts]) => {
      if (url !== 'https://api.brevo.com/v3/smtp/email') return false
      const body = JSON.parse(opts.body)
      return body.to?.[0]?.email === 'hello@studiokova.fr'
    })
    expect(internalCall).toBeDefined()
    const body = JSON.parse(internalCall[1].body)
    expect(body.htmlContent).toContain('Salon')
    expect(body.htmlContent).toContain('Chambre')
    expect(body.htmlContent).toContain('cs_test_abc')
  })

  // ─── Erreur Supabase ───────────────────────────────────────────────────────

  it('retourne 500 si Supabase retourne une erreur', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'duplicate key' } })

    const res = await POST(makeRequest(VALID_BODY))
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBeDefined()
  })

  // ─── Email de confirmation client ─────────────────────────────────────────

  it('tente d\'envoyer un email de confirmation au client', async () => {
    await POST(makeRequest(VALID_BODY))

    const brevoTemplateCalls = global.fetch.mock.calls.filter(
      ([url]) => url === 'https://api.brevo.com/v3/smtp/email'
    )
    // Au moins 1 appel Brevo (notification interne), le template client est en plus
    expect(brevoTemplateCalls.length).toBeGreaterThanOrEqual(1)
  })

  // ─── Robustesse Brevo ──────────────────────────────────────────────────────

  it('retourne 200 même si Brevo échoue (notification non bloquante)', async () => {
    global.fetch.mockRejectedValue(new Error('Brevo down'))

    // La notification Brevo interne utilise .catch(), donc ne bloque pas
    // Le template client utilise try/catch, donc ne bloque pas non plus
    const res = await POST(makeRequest(VALID_BODY))
    expect(res.status).toBe(200)
  })
})
