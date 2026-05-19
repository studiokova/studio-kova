import { supabaseAdmin } from '@/lib/supabase'
import { addContactToList } from '@/lib/brevo'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')?.trim()

  if (!email) return Response.json({ profile: null })

  const { data } = await supabaseAdmin
    .from('style_profiles')
    .select('*')
    .eq('email', email)
    .maybeSingle()

  return Response.json({ profile: data ?? null })
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Corps invalide' }, { status: 400 })
  }

  const {
    email,
    style_name,
    ambiance_cible,
    couleurs_aimees,
    couleurs_evitees,
    matieres_preferees,
    references_visuelles,
    marketing_consent = false,
  } = body

  if (!email) return Response.json({ error: 'email requis' }, { status: 400 })

  // Récupère l'état actuel pour préserver la date du premier consentement
  const { data: existing } = await supabaseAdmin
    .from('style_profiles')
    .select('marketing_consent, consent_date')
    .eq('email', email)
    .maybeSingle()

  const upsertData = {
    email,
    style_name,
    ambiance_cible,
    couleurs_aimees,
    couleurs_evitees,
    matieres_preferees,
    references_visuelles,
    marketing_consent,
    updated_at: new Date().toISOString(),
  }

  // Enregistre consent_date uniquement lors du premier consentement
  if (marketing_consent && !existing?.marketing_consent) {
    upsertData.consent_date = new Date().toISOString()
  }

  const { error } = await supabaseAdmin
    .from('style_profiles')
    .upsert(upsertData, { onConflict: 'email' })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  if (marketing_consent) {
    addContactToList(email, process.env.BREVO_LIST_QUIZZ_MARKETING)
  }

  return Response.json({ success: true })
}
