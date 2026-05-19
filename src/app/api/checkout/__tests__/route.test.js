/**
 * @jest-environment node
 */

const mockCreate = jest.fn()

jest.mock('stripe', () =>
  jest.fn().mockImplementation(() => ({
    checkout: { sessions: { create: mockCreate } },
  }))
)

jest.mock('@/lib/config', () => ({
  OFFERS: { analyse: { stripeId: 'price_test_analyse' } },
}))

jest.mock('@/lib/metaHelpers', () => ({
  generateEventId: () => 'evt_test_123',
}))

const { POST } = require('../route')

function makeRequest(body) {
  return new Request('http://localhost/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : 'not-json{{{',
  })
}

describe('POST /api/checkout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
    process.env.NEXT_PUBLIC_APP_URL = 'https://studiokova.fr'
  })

  it('crée une session Stripe et retourne une URL', async () => {
    mockCreate.mockResolvedValueOnce({ url: 'https://checkout.stripe.com/pay/test' })

    const res = await POST(makeRequest({
      email: 'client@test.fr',
      photoUrls: ['https://blob.example.com/photo.jpg'],
      roomContext: { type_piece: 'Salon' },
      styleContext: { style: 'Épuré' },
    }))

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.url).toBe('https://checkout.stripe.com/pay/test')
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'payment',
        customer_email: 'client@test.fr',
        line_items: [{ price: 'price_test_analyse', quantity: 1 }],
        metadata: expect.objectContaining({
          meta_event_id: 'evt_test_123',
        }),
      })
    )
  })

  it('inclut les UTMs dans les metadata si fournis', async () => {
    mockCreate.mockResolvedValueOnce({ url: 'https://checkout.stripe.com/pay/test' })

    await POST(makeRequest({
      email: 'client@test.fr',
      photoUrls: ['https://blob.example.com/photo.jpg'],
      roomContext: { type_piece: 'Salon' },
      styleContext: { style: 'Épuré' },
      utms: { utm_source: 'instagram', utm_medium: 'social' },
    }))

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          utm_source: 'instagram',
          utm_medium: 'social',
        }),
      })
    )
  })

  it('retourne 400 si email manquant', async () => {
    const res = await POST(makeRequest({
      photoUrls: ['https://blob.example.com/photo.jpg'],
      roomContext: { type_piece: 'Salon' },
      styleContext: { style: 'Épuré' },
    }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/requis/)
  })

  it('retourne 400 si photoUrls est vide', async () => {
    const res = await POST(makeRequest({
      email: 'client@test.fr',
      photoUrls: [],
      roomContext: { type_piece: 'Salon' },
      styleContext: { style: 'Épuré' },
    }))
    expect(res.status).toBe(400)
  })

  it('retourne 400 si roomContext manquant', async () => {
    const res = await POST(makeRequest({
      email: 'client@test.fr',
      photoUrls: ['https://blob.example.com/photo.jpg'],
      styleContext: { style: 'Épuré' },
    }))
    expect(res.status).toBe(400)
  })

  it('retourne 400 si styleContext manquant', async () => {
    const res = await POST(makeRequest({
      email: 'client@test.fr',
      photoUrls: ['https://blob.example.com/photo.jpg'],
      roomContext: { type_piece: 'Salon' },
    }))
    expect(res.status).toBe(400)
  })

  it('retourne 400 si le corps est invalide (JSON malformé)', async () => {
    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid-json{{',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/Corps invalide/)
  })

  it('retourne 500 si Stripe lève une erreur', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Card declined'))

    const res = await POST(makeRequest({
      email: 'client@test.fr',
      photoUrls: ['https://blob.example.com/photo.jpg'],
      roomContext: { type_piece: 'Salon' },
      styleContext: { style: 'Épuré' },
    }))

    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toMatch(/Erreur de paiement/)
  })
})
