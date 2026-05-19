/**
 * @jest-environment node
 */

const mockMaybeSingle = jest.fn()
const mockUpsert = jest.fn()
const mockSelect = jest.fn()
const mockEq = jest.fn()
const mockFrom = jest.fn()
const mockAddContactToList = jest.fn()

jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: (...args) => mockFrom(...args),
  },
}))

jest.mock('@/lib/brevo', () => ({
  addContactToList: (...args) => mockAddContactToList(...args),
}))

const { GET, POST } = require('../route')

function makeGet(email) {
  const url = email
    ? `http://localhost/api/profile?email=${encodeURIComponent(email)}`
    : 'http://localhost/api/profile'
  return new Request(url)
}

function makePost(body) {
  return new Request('http://localhost/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : 'invalid{{{',
  })
}

function buildChain(overrides = {}) {
  const chain = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue({ data: null }),
    upsert: jest.fn().mockResolvedValue({ error: null }),
    update: jest.fn().mockReturnThis(),
    ...overrides,
  }
  mockFrom.mockReturnValue(chain)
  return chain
}

describe('GET /api/profile', () => {
  beforeEach(() => jest.clearAllMocks())

  it('retourne null si email absent', async () => {
    const res = await GET(makeGet(null))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.profile).toBeNull()
  })

  it('retourne le profil si trouvé', async () => {
    const profile = { email: 'test@test.fr', style_name: 'Épuré' }
    buildChain({ maybeSingle: jest.fn().mockResolvedValue({ data: profile }) })

    const res = await GET(makeGet('test@test.fr'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.profile).toEqual(profile)
  })

  it('retourne null si profil non trouvé', async () => {
    buildChain({ maybeSingle: jest.fn().mockResolvedValue({ data: null }) })

    const res = await GET(makeGet('inconnu@test.fr'))
    const data = await res.json()
    expect(data.profile).toBeNull()
  })
})

describe('POST /api/profile', () => {
  beforeEach(() => jest.clearAllMocks())

  it('crée ou met à jour un profil avec succès', async () => {
    buildChain()

    const res = await POST(makePost({
      email: 'client@test.fr',
      style_name: 'Scandinave',
      marketing_consent: false,
    }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
  })

  it('appelle addContactToList si marketing_consent est true et nouveau consentement', async () => {
    const chain = buildChain({
      maybeSingle: jest.fn().mockResolvedValue({ data: { marketing_consent: false } }),
      upsert: jest.fn().mockResolvedValue({ error: null }),
    })
    mockFrom.mockReturnValue(chain)

    const res = await POST(makePost({
      email: 'client@test.fr',
      marketing_consent: true,
    }))
    expect(res.status).toBe(200)
    expect(mockAddContactToList).toHaveBeenCalledWith(
      'client@test.fr',
      process.env.BREVO_LIST_QUIZZ_MARKETING
    )
  })

  it('n\'appelle pas addContactToList si marketing_consent est false', async () => {
    buildChain()

    await POST(makePost({ email: 'client@test.fr', marketing_consent: false }))
    expect(mockAddContactToList).not.toHaveBeenCalled()
  })

  it('n\'ajoute pas consent_date si consentement déjà existant', async () => {
    const chain = buildChain({
      maybeSingle: jest.fn().mockResolvedValue({
        data: { marketing_consent: true, consent_date: '2025-01-01T00:00:00Z' },
      }),
      upsert: jest.fn().mockResolvedValue({ error: null }),
    })
    mockFrom.mockReturnValue(chain)

    await POST(makePost({ email: 'client@test.fr', marketing_consent: true }))
    expect(mockAddContactToList).toHaveBeenCalled()
  })

  it('retourne 400 si email manquant', async () => {
    const res = await POST(makePost({ style_name: 'Industriel' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/email requis/)
  })

  it('retourne 400 si le corps est invalide', async () => {
    const req = new Request('http://localhost/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid{{{',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/Corps invalide/)
  })

  it('retourne 500 si Supabase retourne une erreur', async () => {
    const chain = buildChain({
      maybeSingle: jest.fn().mockResolvedValue({ data: null }),
      upsert: jest.fn().mockResolvedValue({ error: { message: 'DB error' } }),
    })
    mockFrom.mockReturnValue(chain)

    const res = await POST(makePost({ email: 'client@test.fr' }))
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBe('DB error')
  })
})
