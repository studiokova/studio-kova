import { put } from '@vercel/blob'

export async function POST(request) {
  const formData = await request.formData()
  const files = formData.getAll('files')

  if (!files.length || files.every(f => typeof f === 'string')) {
    return Response.json({ error: 'Fichier(s) manquant(s)' }, { status: 400 })
  }

  try {
    const uploads = await Promise.all(
      files
        .filter(f => typeof f !== 'string')
        .map(f => put(f.name, f, { access: 'public', addRandomSuffix: true }))
    )
    return Response.json({ urls: uploads.map(b => b.url) })
  } catch (err) {
    console.error('[upload]', err?.message)
    return Response.json({ error: "Erreur lors de l'upload" }, { status: 500 })
  }
}
