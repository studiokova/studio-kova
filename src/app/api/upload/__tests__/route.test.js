/**
 * @jest-environment node
 */

const mockHandleUpload = jest.fn()

jest.mock('@vercel/blob/client', () => ({
  handleUpload: (...args) => mockHandleUpload(...args),
}))

const { POST } = require('../route')

function makeJsonRequest(body) {
  return new Request('http://localhost/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/upload', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('génère un token client pour un upload', async () => {
    mockHandleUpload.mockResolvedValueOnce({
      type: 'blob.generate-client-token',
      clientToken: 'fake-token',
    })

    const res = await POST(makeJsonRequest({
      type: 'blob.generate-client-token',
      payload: { pathname: 'photo.webp', multipart: false, clientPayload: null },
    }))

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.clientToken).toBe('fake-token')
    expect(mockHandleUpload).toHaveBeenCalledTimes(1)
  })

  it('confirme la complétion d\'un upload', async () => {
    mockHandleUpload.mockResolvedValueOnce({
      type: 'blob.upload-completed',
      response: 'ok',
    })

    const res = await POST(makeJsonRequest({
      type: 'blob.upload-completed',
      payload: { blob: { url: 'https://blob.example.com/photo.webp' }, tokenPayload: null },
    }))

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.response).toBe('ok')
  })

  it('retourne 400 si handleUpload lève une erreur', async () => {
    mockHandleUpload.mockRejectedValueOnce(new Error('Bad request'))

    const res = await POST(makeJsonRequest({}))

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/upload/)
  })

  it('passe onBeforeGenerateToken avec les bons types et la bonne taille', async () => {
    mockHandleUpload.mockImplementationOnce(async ({ onBeforeGenerateToken }) => {
      const tokenConfig = await onBeforeGenerateToken('photo.webp', null, false)
      expect(tokenConfig.allowedContentTypes).toContain('image/jpeg')
      expect(tokenConfig.allowedContentTypes).toContain('image/png')
      expect(tokenConfig.allowedContentTypes).toContain('image/webp')
      expect(tokenConfig.maximumSizeInBytes).toBe(5 * 1024 * 1024)
      expect(tokenConfig.addRandomSuffix).toBe(true)
      return { type: 'blob.generate-client-token', clientToken: 'ok' }
    })

    const res = await POST(makeJsonRequest({ type: 'blob.generate-client-token' }))
    expect(res.status).toBe(200)
  })
})
