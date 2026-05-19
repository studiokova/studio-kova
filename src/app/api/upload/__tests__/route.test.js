/**
 * @jest-environment node
 */

const mockPut = jest.fn()

jest.mock('@vercel/blob', () => ({
  put: (...args) => mockPut(...args),
}))

const { POST } = require('../route')

function makeFileRequest(files) {
  const formData = new FormData()
  files.forEach(f => formData.append('files', f))
  return new Request('http://localhost/api/upload', { method: 'POST', body: formData })
}

function makeBlob(name, content = 'data') {
  return new File([content], name, { type: 'image/webp' })
}

describe('POST /api/upload', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('uploade les fichiers et retourne les URLs', async () => {
    mockPut.mockResolvedValueOnce({ url: 'https://blob.example.com/photo-abc.webp' })

    const file = makeBlob('photo.webp')
    const res = await POST(makeFileRequest([file]))

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.urls).toEqual(['https://blob.example.com/photo-abc.webp'])
    expect(mockPut).toHaveBeenCalledWith(
      'photo.webp',
      expect.anything(),
      { access: 'public', addRandomSuffix: true }
    )
  })

  it('uploade plusieurs fichiers', async () => {
    mockPut
      .mockResolvedValueOnce({ url: 'https://blob.example.com/photo1.webp' })
      .mockResolvedValueOnce({ url: 'https://blob.example.com/photo2.webp' })

    const res = await POST(makeFileRequest([makeBlob('photo1.webp'), makeBlob('photo2.webp')]))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.urls).toHaveLength(2)
  })

  it('retourne 400 si aucun fichier envoyé', async () => {
    const formData = new FormData()
    const req = new Request('http://localhost/api/upload', { method: 'POST', body: formData })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/manquant/)
  })

  it('retourne 400 si files contient uniquement des strings', async () => {
    const formData = new FormData()
    formData.append('files', 'just-a-string')
    const req = new Request('http://localhost/api/upload', { method: 'POST', body: formData })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('retourne 500 si put() lève une erreur', async () => {
    mockPut.mockRejectedValueOnce(new Error('Blob service unavailable'))

    const res = await POST(makeFileRequest([makeBlob('photo.webp')]))
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toMatch(/upload/)
  })
})
