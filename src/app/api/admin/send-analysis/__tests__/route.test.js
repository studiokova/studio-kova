/**
 * @jest-environment node
 */

const mockSingle = jest.fn()
const mockUpdate = jest.fn()
const mockFrom = jest.fn()
const mockSendTransactionalEmail = jest.fn()

jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: (...args) => mockFrom(...args),
  },
}))

jest.mock('@/lib/brevo', () => ({
  sendTransactionalEmail: (...args) => mockSendTransactionalEmail(...args),
}))

const { POST } = require('../route')

function makeRequest(secret, body) {
  const headers = { 'Content-Type': 'application/json' }
  if (secret !== undefined) headers['x-admin-secret'] = secret
  return new Request('http://localhost/api/admin/send-analysis', {
    method: 'POST',
    headers,
    body: body !== undefined ? JSON.stringify(body) : 'invalid{{{',
  })
}

function buildSelectChain(result) {
  const chain = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(result),
  }
  const updateChain = {
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockResolvedValue({ error: null }),
  }
  mockFrom.mockImplementation((table) => {
    if (table === 'room_analyses') return { ...chain, ...updateChain, select: chain.select }
    return updateChain
  })
  return chain
}

describe('POST /api/admin/send-analysis', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ADMIN_SECRET = 'secret-admin-test'
    process.env.BREVO_TEMPLATE_ID_LIVRAISON_PDF = '7'
    mockSendTransactionalEmail.mockResolvedValue()
  })

  it('retourne 401 si x-admin-secret manquant', async () => {
    const res = await POST(makeRequest(undefined, { analysisId: 'uuid-1' }))
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  it('retourne 401 si x-admin-secret invalide', async () => {
    const res = await POST(makeRequest('mauvais-secret', { analysisId: 'uuid-1' }))
    expect(res.status).toBe(401)
  })

  it('retourne 400 si corps JSON invalide', async () => {
    const req = new Request('http://localhost/api/admin/send-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': 'secret-admin-test' },
      body: 'invalid{{{',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/Corps invalide/)
  })

  it('retourne 400 si analysisId manquant', async () => {
    const res = await POST(makeRequest('secret-admin-test', {}))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/analysisId requis/)
  })

  it('retourne 404 si l\'analyse est introuvable', async () => {
    const selectChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
    }
    mockFrom.mockReturnValue(selectChain)

    const res = await POST(makeRequest('secret-admin-test', { analysisId: 'uuid-inexistant' }))
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toMatch(/introuvable/)
  })

  it('retourne 400 si l\'analyse n\'est pas done', async () => {
    const selectChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'uuid-1', email: 'client@test.fr', status: 'pending', pdf_url: null },
        error: null,
      }),
    }
    mockFrom.mockReturnValue(selectChain)

    const res = await POST(makeRequest('secret-admin-test', { analysisId: 'uuid-1' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/non prête|PDF manquant/)
  })

  it('retourne 400 si pdf_url est absent', async () => {
    const selectChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'uuid-1', email: 'client@test.fr', status: 'done', pdf_url: null },
        error: null,
      }),
    }
    mockFrom.mockReturnValue(selectChain)

    const res = await POST(makeRequest('secret-admin-test', { analysisId: 'uuid-1' }))
    expect(res.status).toBe(400)
  })

  it('envoie l\'email et met à jour delivered_at', async () => {
    const updateEq = jest.fn().mockResolvedValue({ error: null })
    const updateChain = { update: jest.fn().mockReturnValue({ eq: updateEq }) }
    const selectChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'uuid-1',
          email: 'client@test.fr',
          status: 'done',
          pdf_url: 'https://blob.example.com/report.pdf',
        },
        error: null,
      }),
    }

    let callCount = 0
    mockFrom.mockImplementation(() => {
      callCount++
      if (callCount === 1) return selectChain
      return updateChain
    })

    const res = await POST(makeRequest('secret-admin-test', { analysisId: 'uuid-1' }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)

    expect(mockSendTransactionalEmail).toHaveBeenCalledWith(
      'client@test.fr',
      7,
      { pdf_url: 'https://blob.example.com/report.pdf' }
    )
    expect(updateChain.update).toHaveBeenCalledWith(
      expect.objectContaining({ delivered_at: expect.any(String) })
    )
  })
})
