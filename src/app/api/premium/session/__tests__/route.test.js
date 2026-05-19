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
    ? `http://localhost/api/premium/session?session_id=${sessionId}`
    : 'http://localhost/api/premium/session'
  return new Request(url)
}

describe('GET /api/premium/session', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
  })

  it('retourne email et rooms_count depuis la session Stripe', async () => {
    mockRetrieve.mockResolvedValueOnce({
      customer_details: { email: 'client@test.fr' },
      metadata: { rooms: '3' },
    })

    const res = await GET(makeRequest('cs_test_abc'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.email).toBe('client@test.fr')
    expect(data.rooms_count).toBe(3)
  })

  it('utilise customer_email si customer_details est absent', async () => {
    mockRetrieve.mockResolvedValueOnce({
      customer_details: null,
      customer_email: 'fallback@test.fr',
      metadata: { rooms: '1' },
    })

    const res = await GET(makeRequest('cs_test_abc'))
    const data = await res.json()
    expect(data.email).toBe('fallback@test.fr')
  })

  it('retourne rooms_count = 1 si metadata.rooms est absent', async () => {
    mockRetrieve.mockResolvedValueOnce({
      customer_details: { email: 'test@test.fr' },
      metadata: {},
    })

    const res = await GET(makeRequest('cs_test_abc'))
    const data = await res.json()
    expect(data.rooms_count).toBe(1)
  })

  it('retourne 400 si session_id est absent', async () => {
    const res = await GET(makeRequest(null))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBeDefined()
  })

  it('retourne 404 si Stripe lève une erreur', async () => {
    mockRetrieve.mockRejectedValueOnce(new Error('No such session'))

    const res = await GET(makeRequest('cs_invalid'))
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toBeDefined()
  })
})
