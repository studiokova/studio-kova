/**
 * @jest-environment node
 */

const mockOrder = jest.fn()
const mockIs = jest.fn()
const mockEq = jest.fn()
const mockSelect = jest.fn()
const mockFrom = jest.fn()

jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: (...args) => mockFrom(...args),
  },
}))

const { GET } = require('../route')

function makeRequest(secret) {
  const headers = {}
  if (secret !== undefined) headers['x-admin-secret'] = secret
  return new Request('http://localhost/api/admin/pending-analyses', { headers })
}

function buildChain(result) {
  const chain = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue(result),
  }
  mockFrom.mockReturnValue(chain)
  return chain
}

describe('GET /api/admin/pending-analyses', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ADMIN_SECRET = 'secret-admin-test'
  })

  it('retourne 401 si x-admin-secret manquant', async () => {
    const res = await GET(makeRequest(undefined))
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  it('retourne 401 si x-admin-secret invalide', async () => {
    const res = await GET(makeRequest('mauvais-secret'))
    expect(res.status).toBe(401)
  })

  it('retourne la liste des analyses en attente', async () => {
    const analyses = [
      {
        id: 'uuid-1',
        email: 'client@test.fr',
        created_at: '2025-05-01T10:00:00Z',
        pdf_url: 'https://blob.example.com/report.pdf',
        room_context: { type_piece: 'Salon' },
      },
    ]
    buildChain({ data: analyses, error: null })

    const res = await GET(makeRequest('secret-admin-test'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.analyses).toHaveLength(1)
    expect(data.analyses[0].id).toBe('uuid-1')
    expect(data.analyses[0].type_piece).toBe('Salon')
    expect(data.analyses[0].email).toBe('client@test.fr')
  })

  it('retourne type_piece null si room_context absent', async () => {
    buildChain({
      data: [{
        id: 'uuid-2',
        email: 'client2@test.fr',
        created_at: '2025-05-01T10:00:00Z',
        pdf_url: 'https://blob.example.com/report2.pdf',
        room_context: null,
      }],
      error: null,
    })

    const res = await GET(makeRequest('secret-admin-test'))
    const data = await res.json()
    expect(data.analyses[0].type_piece).toBeNull()
  })

  it('retourne une liste vide si aucune analyse en attente', async () => {
    buildChain({ data: [], error: null })

    const res = await GET(makeRequest('secret-admin-test'))
    const data = await res.json()
    expect(data.analyses).toEqual([])
  })

  it('retourne 500 si Supabase retourne une erreur', async () => {
    buildChain({ data: null, error: { message: 'DB error' } })

    const res = await GET(makeRequest('secret-admin-test'))
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toMatch(/base de données/)
  })
})
