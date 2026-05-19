/**
 * @jest-environment node
 */

const mockRetrieve = jest.fn()

jest.mock('stripe', () =>
  jest.fn().mockImplementation(() => ({
    checkout: { sessions: { retrieve: mockRetrieve } },
  }))
)

const { GET } = require('../route')

function makeRequest(sessionId) {
  const url = sessionId
    ? `http://localhost/api/checkout/session?session_id=${sessionId}`
    : 'http://localhost/api/checkout/session'
  return new Request(url)
}

describe('GET /api/checkout/session', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
  })

  it('retourne les données de la session si paiement confirmé', async () => {
    mockRetrieve.mockResolvedValueOnce({
      payment_status: 'paid',
      customer_details: { email: 'client@test.fr' },
      customer_email: null,
      metadata: { meta_event_id: 'evt_abc' },
      amount_total: 4900,
    })

    const res = await GET(makeRequest('cs_test_abc'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.email).toBe('client@test.fr')
    expect(data.meta_event_id).toBe('evt_abc')
    expect(data.amount_total).toBe(4900)
  })

  it('utilise customer_email si customer_details est absent', async () => {
    mockRetrieve.mockResolvedValueOnce({
      payment_status: 'paid',
      customer_details: null,
      customer_email: 'fallback@test.fr',
      metadata: {},
      amount_total: 4900,
    })

    const res = await GET(makeRequest('cs_test_abc'))
    const data = await res.json()
    expect(data.email).toBe('fallback@test.fr')
  })

  it('retourne 404 si paiement non confirmé', async () => {
    mockRetrieve.mockResolvedValueOnce({
      payment_status: 'unpaid',
      customer_details: { email: 'client@test.fr' },
      metadata: {},
      amount_total: 4900,
    })

    const res = await GET(makeRequest('cs_test_abc'))
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toMatch(/Paiement non confirmé/)
  })

  it('retourne 400 si session_id absent', async () => {
    const res = await GET(makeRequest(null))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/session_id requis/)
  })

  it('retourne 404 si Stripe lève une erreur', async () => {
    mockRetrieve.mockRejectedValueOnce(new Error('No such checkout.session'))

    const res = await GET(makeRequest('cs_invalid'))
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toMatch(/introuvable/)
  })
})
