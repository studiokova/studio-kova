/**
 * @jest-environment node
 */

const mockConstructEvent = jest.fn()
const mockMaybySingle = jest.fn()
const mockSingle = jest.fn()
const mockFrom = jest.fn()
const mockAddContactToList = jest.fn()
const mockRemoveContactFromList = jest.fn()
const mockSendMetaEvent = jest.fn()

jest.mock('stripe', () =>
  jest.fn().mockImplementation(() => ({
    webhooks: { constructEvent: mockConstructEvent },
  }))
)

jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: { from: (...args) => mockFrom(...args) },
}))

jest.mock('@/lib/brevo', () => ({
  addContactToList: (...args) => mockAddContactToList(...args),
  removeContactFromList: (...args) => mockRemoveContactFromList(...args),
}))

jest.mock('@/lib/metaCapi', () => ({
  sendMetaEvent: (...args) => mockSendMetaEvent(...args),
}))

const { POST } = require('../route')

function makeRequest(body = '', signature = 'stripe-sig-test') {
  return new Request('http://localhost/api/webhook', {
    method: 'POST',
    headers: { 'stripe-signature': signature },
    body,
  })
}

function buildSupabaseChain(overrides = {}) {
  return {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue({ data: null }),
    single: jest.fn().mockResolvedValue({ data: { id: 'analysis-id' }, error: null }),
    ...overrides,
  }
}

function makeAnalyseEvent(metadataOverrides = {}) {
  return {
    type: 'checkout.session.completed',
    data: {
      object: {
        customer_email: 'client@test.fr',
        payment_intent: 'pi_test_123',
        customer_details: { email: 'client@test.fr' },
        metadata: {
          room_analysis_id: 'analysis-uuid-123',
          meta_event_id: 'evt_test_123',
          utm_source: 'instagram',
          ...metadataOverrides,
        },
      },
    },
  }
}

describe('POST /api/webhook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
    process.env.NEXT_PUBLIC_APP_URL = 'https://studiokova.fr'
    process.env.BREVO_LIST_ANALYSIS = 'list-analysis-id'
    process.env.BREVO_LIST_ANALYSIS_MARKETING = 'list-analysis-marketing-id'
    process.env.BREVO_LIST_QUIZZ_MARKETING = 'list-quiz-marketing-id'
    mockSendMetaEvent.mockResolvedValue()
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
  })

  it('retourne 400 si la signature Stripe est invalide', async () => {
    mockConstructEvent.mockImplementation(() => { throw new Error('Invalid signature') })

    const res = await POST(makeRequest('raw-body'))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/Signature invalide/)
  })

  it('retourne 200 received:true pour un type d\'événement non géré', async () => {
    mockConstructEvent.mockReturnValue({ type: 'payment_intent.succeeded', data: { object: {} } })

    const res = await POST(makeRequest('raw-body'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.received).toBe(true)
  })

  describe('Sur-Mesure (metadata.rooms présent)', () => {
    it('déclenche Meta CAPI Purchase avec meta_event_id et retourne 200', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            customer_email: 'client@test.fr',
            payment_intent: 'pi_test',
            customer_details: { email: 'client@test.fr' },
            metadata: {
              rooms: '2',
              meta_event_id: 'evt_123',
              meta_value: '299',
              utm_source: 'instagram',
            },
          },
        },
      })

      const res = await POST(makeRequest('body'))
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.received).toBe(true)
      expect(mockSendMetaEvent).toHaveBeenCalledWith(
        expect.objectContaining({ eventName: 'Purchase', eventId: 'evt_123', value: 299 })
      )
    })

    it('gère l\'absence de meta_event_id sans planter', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            customer_email: 'client@test.fr',
            payment_intent: 'pi_test',
            customer_details: null,
            metadata: { rooms: '1' },
          },
        },
      })

      const res = await POST(makeRequest('body'))
      expect(res.status).toBe(200)
      expect(mockSendMetaEvent).not.toHaveBeenCalled()
    })
  })

  describe('Analyse 69€', () => {
    it('retourne 400 si room_analysis_id est absent des métadonnées', async () => {
      mockConstructEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: {
          object: {
            customer_email: 'client@test.fr',
            payment_intent: 'pi_test',
            customer_details: { email: 'client@test.fr' },
            metadata: { meta_event_id: 'evt_123' },
          },
        },
      })

      const res = await POST(makeRequest('body'))
      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error).toMatch(/room_analysis_id manquant/)
    })

    it('met à jour la ligne pending → paid et déclenche la chaîne complète', async () => {
      const styleProfile = { id: 'prof-1', email: 'client@test.fr', marketing_consent: true }
      mockFrom.mockImplementation((table) => {
        if (table === 'style_profiles') {
          return buildSupabaseChain({ maybeSingle: jest.fn().mockResolvedValue({ data: styleProfile }) })
        }
        return buildSupabaseChain()
      })

      mockConstructEvent.mockReturnValue(makeAnalyseEvent())

      const res = await POST(makeRequest('body'))
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.received).toBe(true)

      expect(mockAddContactToList).toHaveBeenCalled()
      expect(mockRemoveContactFromList).toHaveBeenCalled()
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/analyze'),
        expect.objectContaining({ method: 'POST' })
      )
      expect(mockSendMetaEvent).toHaveBeenCalledWith(
        expect.objectContaining({ eventName: 'Purchase', value: 69 })
      )
    })

    it('retourne 200 sans déclencher l\'analyse si la ligne n\'est plus en pending (idempotence)', async () => {
      const styleProfile = { id: 'prof-1', email: 'client@test.fr', marketing_consent: false }
      mockFrom.mockImplementation((table) => {
        if (table === 'style_profiles') {
          return buildSupabaseChain({ maybeSingle: jest.fn().mockResolvedValue({ data: styleProfile }) })
        }
        return buildSupabaseChain({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        })
      })

      mockConstructEvent.mockReturnValue(makeAnalyseEvent())

      const res = await POST(makeRequest('body'))
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.received).toBe(true)

      expect(global.fetch).not.toHaveBeenCalledWith(
        expect.stringContaining('/api/analyze'),
        expect.anything()
      )
      expect(mockAddContactToList).not.toHaveBeenCalled()
    })

    it('n\'ajoute pas à marketing si styleProfile.marketing_consent est false', async () => {
      const styleProfile = { id: 'prof-1', email: 'client@test.fr', marketing_consent: false }
      mockFrom.mockImplementation((table) => {
        if (table === 'style_profiles') {
          return buildSupabaseChain({ maybeSingle: jest.fn().mockResolvedValue({ data: styleProfile }) })
        }
        return buildSupabaseChain()
      })

      mockConstructEvent.mockReturnValue(makeAnalyseEvent({ meta_event_id: '' }))

      await POST(makeRequest('body'))
      const listCalls = mockAddContactToList.mock.calls
      const marketingCall = listCalls.find(c => c[1] === process.env.BREVO_LIST_ANALYSIS_MARKETING)
      expect(marketingCall).toBeUndefined()
    })
  })
})
