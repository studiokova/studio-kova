/**
 * @jest-environment node
 */

const mockCreate = jest.fn()
const mockDel = jest.fn()
const mockFrom = jest.fn()

jest.mock('@anthropic-ai/sdk', () =>
  jest.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  }))
)

jest.mock('@vercel/blob', () => ({
  del: (...args) => mockDel(...args),
}))

jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: { from: (...args) => mockFrom(...args) },
}))

const { POST } = require('../route')

const MOCK_AI_RESULT = {
  cas_usage: 'deco',
  diagnostic: 'Pièce lumineuse.',
  directions: [
    {
      intitule: 'Neutre',
      description: 'Direction sobre.',
      palette: [{ nom: 'Blanc Craie', hex: '#F5EFE4', usage: 'Murs', statut: 'a_appliquer' }],
      actions: [{ action: 'Repeindre les murs', pourquoi: 'Photo montre murs jaunes', cout_estime: '200-400€' }],
    },
    {
      intitule: 'Médian',
      description: 'Direction équilibrée.',
      palette: [{ nom: 'Sauge', hex: '#3D6B52', usage: 'Mur accent', statut: 'a_appliquer' }],
      actions: [{ action: 'Poser un tapis', pourquoi: 'Sol nu visible', cout_estime: '80-150€' }],
    },
    {
      intitule: 'Coloré',
      description: 'Direction affirmée.',
      palette: [{ nom: 'Ocre', hex: '#E8C97A', usage: 'Coussins', statut: 'a_appliquer' }],
      actions: [{ action: 'Ajouter des textiles colorés', pourquoi: 'Manque de chaleur', cout_estime: '50-100€' }],
    },
  ],
  matieres: ['Lin', 'Chêne'],
  a_eviter: ['Plastique'],
  phrase_cle: 'Une pièce épurée et chaleureuse.',
}

function makePost(body) {
  return new Request('http://localhost/api/analyze', {
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

function makeAnalysis(overrides = {}) {
  return {
    id: 'analysis-uuid',
    email: 'client@test.fr',
    status: 'paid',
    photo_url: 'https://blob.example.com/photo.jpg',
    room_context: { type_piece: 'Salon', approche: 'Rénover', budget: '500-1000€', probleme: 'Trop sombre', motivation: 'Déménagement' },
    style_context: { ambiance: ['Épuré'], couleur_aimee: 'Beige', couleur_evitee: 'Orange', matieres: ['Lin'] },
    style_profile_snap: null,
    ...overrides,
  }
}

describe('POST /api/analyze', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test'
    process.env.NEXT_PUBLIC_APP_URL = 'https://studiokova.fr'
    process.env.BREVO_API_KEY = 'brevo-test-key'
    process.env.NODE_ENV = 'test'
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ pdfUrl: 'https://blob.example.com/report.pdf' }) })
    mockDel.mockResolvedValue()
  })

  it('retourne 400 si le corps JSON est invalide', async () => {
    const req = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid{{{',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/Corps invalide/)
  })

  it('retourne 400 si analysisId est absent', async () => {
    const res = await POST(makePost({}))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/analysisId requis/)
  })

  it('retourne 404 si l\'analyse est introuvable', async () => {
    const chain = buildChain({ single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }) })
    mockFrom.mockReturnValue(chain)

    const res = await POST(makePost({ analysisId: 'uuid-inexistant' }))
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toMatch(/introuvable/)
  })

  it('appelle Claude et retourne success:true sur chemin heureux', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ text: JSON.stringify(MOCK_AI_RESULT) }],
    })

    let fromCallCount = 0
    mockFrom.mockImplementation(() => {
      fromCallCount++
      return buildChain({
        single: jest.fn().mockResolvedValue({ data: makeAnalysis(), error: null }),
      })
    })

    const res = await POST(makePost({ analysisId: 'analysis-uuid' }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.result).toMatchObject({ diagnostic: expect.any(String) })
    expect(mockCreate).toHaveBeenCalled()
  })

  it('fetch le style_profile si style_profile_snap est null', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ text: JSON.stringify(MOCK_AI_RESULT) }],
    })

    const profile = { id: 'prof-1', style_name: 'Scandinave' }
    let fromCallCount = 0
    mockFrom.mockImplementation((table) => {
      fromCallCount++
      if (table === 'style_profiles') {
        return buildChain({ single: jest.fn().mockResolvedValue({ data: profile, error: null }) })
      }
      return buildChain({
        single: jest.fn().mockResolvedValue({ data: makeAnalysis({ style_profile_snap: null, email: 'client@test.fr' }), error: null }),
      })
    })

    await POST(makePost({ analysisId: 'analysis-uuid' }))
    expect(mockFrom).toHaveBeenCalledWith('style_profiles')
  })

  it('parse photo_url si c\'est un tableau JSON stringifié', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ text: JSON.stringify(MOCK_AI_RESULT) }],
    })

    mockFrom.mockReturnValue(buildChain({
      single: jest.fn().mockResolvedValue({
        data: makeAnalysis({ photo_url: JSON.stringify(['https://blob.example.com/photo1.jpg', 'https://blob.example.com/photo2.jpg']) }),
        error: null,
      }),
    }))

    const res = await POST(makePost({ analysisId: 'analysis-uuid' }))
    expect(res.status).toBe(200)
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            content: expect.arrayContaining([
              expect.objectContaining({ type: 'image' }),
              expect.objectContaining({ type: 'image' }),
            ]),
          }),
        ]),
      })
    )
  })

  it('retourne 500 si Claude échoue toutes les tentatives', async () => {
    mockCreate.mockRejectedValue(new Error('API error'))
    mockFrom.mockReturnValue(buildChain({
      single: jest.fn().mockResolvedValue({ data: makeAnalysis(), error: null }),
    }))

    const res = await POST(makePost({ analysisId: 'analysis-uuid' }))
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBeDefined()
  }, 10000)

  it('parse Claude JSON avec backticks', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ text: '```json\n' + JSON.stringify(MOCK_AI_RESULT) + '\n```' }],
    })
    mockFrom.mockReturnValue(buildChain({
      single: jest.fn().mockResolvedValue({ data: makeAnalysis(), error: null }),
    }))

    const res = await POST(makePost({ analysisId: 'analysis-uuid' }))
    expect(res.status).toBe(200)
  })

  it('supprime les photos en production', async () => {
    const savedEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    mockCreate.mockResolvedValueOnce({
      content: [{ text: JSON.stringify(MOCK_AI_RESULT) }],
    })
    mockFrom.mockReturnValue(buildChain({
      single: jest.fn().mockResolvedValue({
        data: makeAnalysis({ photo_url: JSON.stringify(['https://blob.example.com/p1.jpg']) }),
        error: null,
      }),
    }))

    await POST(makePost({ analysisId: 'analysis-uuid' }))
    expect(mockDel).toHaveBeenCalled()

    process.env.NODE_ENV = savedEnv
  })
})
