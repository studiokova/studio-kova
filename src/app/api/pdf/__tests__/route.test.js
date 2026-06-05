/**
 * @jest-environment node
 */

jest.mock('fs', () => ({
  readFileSync: jest.fn(() => Buffer.from('fake-logo-png-data')),
}))

const mockRenderToBuffer = jest.fn()
const mockPut = jest.fn()
const mockFrom = jest.fn()

jest.mock('@react-pdf/renderer', () => ({
  renderToBuffer: (...args) => mockRenderToBuffer(...args),
}))

jest.mock('@vercel/blob', () => ({
  put: (...args) => mockPut(...args),
}))

jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: { from: (...args) => mockFrom(...args) },
}))

jest.mock('../KovaPdfDocument', () => ({
  KovaPdfDocument: () => null,
}))

jest.mock('@/lib/ralMatch', () => ({
  ralMatch: jest.fn((hex) => hex ? { code: 'H060L50C50', nom: 'Test Brown', hex: '#af642b' } : null),
}))

const { POST } = require('../route')

function makePost(body) {
  return new Request('http://localhost/api/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : 'invalid{{{',
  })
}

function buildChain(overrides = {}) {
  return {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    ...overrides,
  }
}

const MOCK_ANALYSIS = {
  ai_result: { diagnostic: 'Belle pièce.', palette: [], priorites: [], matieres: [], a_eviter: [], phrase_cle: 'Épuré.' },
  photo_url: 'https://blob.example.com/photo.jpg',
  room_context: { type_piece: 'Salon', budget: '500€' },
  style_profile_snap: null,
}

describe('POST /api/pdf', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
    mockRenderToBuffer.mockResolvedValue(Buffer.from('pdf-content'))
    mockPut.mockResolvedValue({ url: 'https://blob.example.com/report.pdf' })
  })

  it('retourne 400 si corps invalide', async () => {
    const req = new Request('http://localhost/api/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid{{{',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/Corps invalide/)
  })

  it('retourne 400 si analysisId absent', async () => {
    const res = await POST(makePost({}))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/analysisId requis/)
  })

  it('retourne 404 si analyse introuvable', async () => {
    mockFrom.mockReturnValue(buildChain({
      single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
    }))

    const res = await POST(makePost({ analysisId: 'uuid-inexistant' }))
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toMatch(/introuvable/)
  })

  it('retourne 404 si ai_result est absent', async () => {
    mockFrom.mockReturnValue(buildChain({
      single: jest.fn().mockResolvedValue({ data: { ...MOCK_ANALYSIS, ai_result: null }, error: null }),
    }))

    const res = await POST(makePost({ analysisId: 'uuid-1' }))
    expect(res.status).toBe(404)
  })

  it('génère le PDF et retourne l\'URL', async () => {
    mockFrom.mockReturnValue(buildChain({
      single: jest.fn().mockResolvedValue({ data: MOCK_ANALYSIS, error: null }),
    }))

    const res = await POST(makePost({ analysisId: 'uuid-1' }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.pdfUrl).toBe('https://blob.example.com/report.pdf')
    expect(mockRenderToBuffer).toHaveBeenCalled()
    expect(mockPut).toHaveBeenCalledWith(
      'analyses/uuid-1.pdf',
      expect.anything(),
      expect.objectContaining({ contentType: 'application/pdf' })
    )
  })

  it('parse room_context si stocké comme chaîne JSON', async () => {
    const analysis = {
      ...MOCK_ANALYSIS,
      room_context: JSON.stringify({ type_piece: 'Chambre', budget: '300€' }),
    }
    mockFrom.mockReturnValue(buildChain({
      single: jest.fn().mockResolvedValue({ data: analysis, error: null }),
    }))

    const res = await POST(makePost({ analysisId: 'uuid-1' }))
    expect(res.status).toBe(200)
  })

  it('met photoUrl à null si HEAD check échoue', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false })
    mockFrom.mockReturnValue(buildChain({
      single: jest.fn().mockResolvedValue({ data: MOCK_ANALYSIS, error: null }),
    }))

    const res = await POST(makePost({ analysisId: 'uuid-1' }))
    expect(res.status).toBe(200)
    expect(mockRenderToBuffer).toHaveBeenCalled()
  })

  it('retourne 500 si renderToBuffer lève une erreur', async () => {
    mockFrom.mockReturnValue(buildChain({
      single: jest.fn().mockResolvedValue({ data: MOCK_ANALYSIS, error: null }),
    }))
    mockRenderToBuffer.mockRejectedValueOnce(new Error('PDF generation failed'))

    const res = await POST(makePost({ analysisId: 'uuid-1' }))
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toMatch(/PDF generation failed/)
  })

  it('gère photo_url null', async () => {
    mockFrom.mockReturnValue(buildChain({
      single: jest.fn().mockResolvedValue({ data: { ...MOCK_ANALYSIS, photo_url: null }, error: null }),
    }))

    const res = await POST(makePost({ analysisId: 'uuid-1' }))
    expect(res.status).toBe(200)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('parse photo_url JSON array et prend le premier élément', async () => {
    mockFrom.mockReturnValue(buildChain({
      single: jest.fn().mockResolvedValue({
        data: { ...MOCK_ANALYSIS, photo_url: '["https://blob.example.com/p1.jpg","https://blob.example.com/p2.jpg"]' },
        error: null,
      }),
    }))

    const res = await POST(makePost({ analysisId: 'uuid-1' }))
    expect(res.status).toBe(200)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://blob.example.com/p1.jpg',
      expect.objectContaining({ method: 'HEAD' })
    )
  })
})
