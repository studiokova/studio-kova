import { handleUpload } from '@vercel/blob/client'

export async function POST(request) {
  try {
    const body = await request.json()
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maximumSizeInBytes: 5 * 1024 * 1024,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {},
    })
    return Response.json(jsonResponse)
  } catch (err) {
    console.error('[upload]', err?.message)
    return Response.json({ error: "Erreur lors de l'upload" }, { status: 400 })
  }
}
