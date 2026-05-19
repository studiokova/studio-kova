import { supabaseAdmin } from '@/lib/supabase'
import { sendTransactionalEmail } from '@/lib/brevo'

function checkAuth(request) {
  const secret = request.headers.get('x-admin-secret')
  return secret && secret === process.env.ADMIN_SECRET
}

export async function POST(request) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Corps invalide' }, { status: 400 })
  }

  const { analysisId } = body
  if (!analysisId) return Response.json({ error: 'analysisId requis' }, { status: 400 })

  const { data: analysis, error: fetchError } = await supabaseAdmin
    .from('room_analyses')
    .select('id, email, status, pdf_url')
    .eq('id', analysisId)
    .single()

  if (fetchError || !analysis) {
    return Response.json({ error: 'Analyse introuvable' }, { status: 404 })
  }

  if (analysis.status !== 'done' || !analysis.pdf_url) {
    return Response.json({ error: 'Analyse non prête ou PDF manquant' }, { status: 400 })
  }

  const templateId = parseInt(process.env.BREVO_TEMPLATE_ID_LIVRAISON_PDF || '7')
  await sendTransactionalEmail(analysis.email, templateId, { pdf_url: analysis.pdf_url })

  await supabaseAdmin
    .from('room_analyses')
    .update({ delivered_at: new Date().toISOString() })
    .eq('id', analysisId)

  return Response.json({ success: true })
}
