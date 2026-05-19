import Anthropic from '@anthropic-ai/sdk'
import { del } from '@vercel/blob'
import { supabaseAdmin } from '@/lib/supabase'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const SYSTEM_PROMPT = `Tu es une décoratrice d'intérieur experte, directe et bienveillante.
Tu analyses une pièce à partir de photos et de préférences déclarées.
Tu donnes des recommandations concrètes, actionnables et personnalisées.
Tu ne fais jamais de généralités. Chaque recommandation doit être liée à quelque chose que tu vois dans les photos ou à une préférence explicite.`

function buildPrompt(roomContext, styleContext, styleProfile) {
  const sc = styleContext || {}
  const profileBlock = styleProfile ? `# Son profil style général — contexte de fond uniquement
Profil : ${styleProfile.style_name}
Tendances générales : ${styleProfile.ambiance_cible?.join(', ')}, ${styleProfile.couleurs_aimees?.join(', ')}, ${styleProfile.matieres_preferees?.join(', ')}
Note : ce profil reflète ses goûts généraux. Les préférences exprimées ci-dessus pour cette pièce précise priment toujours sur ce profil.

` : ''

  return `# Cette pièce — priorité absolue
Type de pièce : ${roomContext.type_piece}
Approche souhaitée : ${roomContext.approche}
Ce que la cliente veut garder : ${roomContext.garder || 'non précisé'}
Ce qui la dérange le plus : "${roomContext.probleme || 'non précisé'}"
Budget : ${roomContext.budget}
Pourquoi elle fait cette analyse maintenant : ${roomContext.motivation || 'non précisé'}

# Ses préférences pour cette pièce — priorité haute
Ambiance souhaitée : ${sc.ambiance?.join(', ') || 'non précisé'}
Couleur qu'elle aime : ${sc.couleur_aimee || 'non précisé'}
Couleur qu'elle veut absolument éviter : ${sc.couleur_evitee || 'non précisé'}
Matières qu'elle aime : ${sc.matieres?.join(', ') || 'non précisé'}

${profileBlock}# Règles de recommandation
- Le diagnostic doit citer des éléments concrets visibles sur les photos (proportion, couleur existante, source de lumière, meuble identifiable)
- La palette doit respecter la couleur évitée
- Chaque priorité doit être liée soit à quelque chose vu sur la photo, soit à une préférence explicite
- Le coût estimé doit être réaliste par rapport au budget : ${roomContext.budget}
- La phrase clé décrit l'état final souhaité, pas un conseil

Réponds UNIQUEMENT en JSON valide, sans backticks, sans texte avant ou après :
{
  "diagnostic": "2-3 phrases. Cite des éléments concrets de la photo : lumière, proportions, couleurs existantes.",
  "palette": [{ "nom": "", "hex": "#000000", "usage": "Pour quoi et où dans la pièce" }],
  "priorites": [{ "action": "Verbe d'action + quoi faire concrètement", "pourquoi": "Lien avec la photo ou la préférence", "cout_estime": "Fourchette réaliste en euros" }],
  "matieres": ["", "", ""],
  "a_eviter": ["", ""],
  "phrase_cle": "Une phrase qui décrit l'état final : ce que la pièce deviendra."
}`
}

function parseClaudeJson(text) {
  const cleaned = text
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim()
  return JSON.parse(cleaned)
}

function getPhotoUrls(analysis) {
  if (!analysis.photo_url) return []
  try {
    const parsed = JSON.parse(analysis.photo_url)
    return Array.isArray(parsed) ? parsed : [analysis.photo_url]
  } catch {
    return [analysis.photo_url]
  }
}

const MAX_ATTEMPTS = 3

async function callClaude(prompt, photoUrls) {
  const imageBlocks = photoUrls.map(url => ({
    type: 'image',
    source: { type: 'url', url },
  }))

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: [
        ...imageBlocks,
        { type: 'text', text: prompt },
      ],
    }],
  })
  return parseClaudeJson(response.content[0].text)
}

async function sendAlertEmail(analysisId, clientEmail, errorMsg) {
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY },
    body: JSON.stringify({
      sender: { name: 'Studio Kova', email: 'hello@studiokova.fr' },
      to: [{ email: 'hello@studiokova.fr' }],
      subject: `Analyse échouée — ${analysisId}`,
      textContent: `Cliente : ${clientEmail}\n\nErreur : ${errorMsg}`,
    }),
  }).catch((err) => console.error('[analyze] alert email:', err?.message))
}

export async function POST(request) {
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
    .select('*')
    .eq('id', analysisId)
    .eq('status', 'paid')
    .single()

  if (fetchError || !analysis) {
    return Response.json({ error: 'Analyse introuvable ou non payée' }, { status: 404 })
  }

  await supabaseAdmin.from('room_analyses').update({ status: 'processing' }).eq('id', analysisId)

  if (!analysis.style_profile_snap && analysis.email) {
    const { data: profile } = await supabaseAdmin
      .from('style_profiles')
      .select('*')
      .eq('email', analysis.email)
      .single()

    if (profile) {
      await supabaseAdmin
        .from('room_analyses')
        .update({ style_profile_snap: profile })
        .eq('id', analysisId)

      analysis.style_profile_snap = profile
    }
  }

  const prompt = buildPrompt(analysis.room_context, analysis.style_context || {}, analysis.style_profile_snap || null)
  const photoUrls = getPhotoUrls(analysis)

  let aiResult = null
  let lastError = null

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      aiResult = await callClaude(prompt, photoUrls)
      break
    } catch (err) {
      lastError = err
      console.error(`[analyze] tentative ${attempt}/${MAX_ATTEMPTS} échouée:`, err?.message)
      if (attempt < MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, 1000))
    }
  }

  if (!aiResult) {
    await supabaseAdmin.from('room_analyses').update({ status: 'error' }).eq('id', analysisId)
    await sendAlertEmail(analysisId, analysis.email, lastError?.message)
    return Response.json({ error: lastError?.message }, { status: 500 })
  }

  await supabaseAdmin
    .from('room_analyses')
    .update({ status: 'done', ai_result: aiResult })
    .eq('id', analysisId)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  // 1. Génération PDF — attendue avant suppression des photos
  let pdfUrl = null
  try {
    const pdfRes = await fetch(`${baseUrl}/api/pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysisId }),
    })
    if (pdfRes.ok) {
      const pdfData = await pdfRes.json()
      pdfUrl = pdfData.pdfUrl ?? null
    } else {
      console.error('[analyze] /api/pdf a retourné', pdfRes.status)
    }
  } catch (err) {
    console.error('[analyze] Erreur génération PDF:', err?.message)
  }

  // TODO: réactiver quand l'envoi automatique sera validé
  // Ajouter en haut du fichier : import { sendTransactionalEmail } from '@/lib/brevo'
  // if (pdfUrl) {
  //   await sendTransactionalEmail(
  //     analysis.email,
  //     parseInt(process.env.BREVO_TEMPLATE_ID_LIVRAISON_PDF || '7'),
  //     { pdf_url: pdfUrl }
  //   )
  // }

  // 2. Notification interne — PDF à envoyer manuellement à la cliente
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY },
    body: JSON.stringify({
      sender: { name: 'Studio Kova', email: 'hello@studiokova.fr' },
      to: [{ email: 'hello@studiokova.fr' }],
      subject: `Nouvelle analyse prête — ${analysis.email}`,
      textContent: [`Cliente : ${analysis.email}`, `PDF : ${pdfUrl ?? 'ERREUR GÉNÉRATION PDF'}`, `Diagnostic : ${aiResult.diagnostic}`].join('\n\n'),
    }),
  }).catch((err) => console.error('[analyze] notification interne:', err?.message))

  // 3. Suppression des photos originales (désactivée en développement pour faciliter les tests)
  if (process.env.NODE_ENV !== 'development') {
    await Promise.allSettled(
      photoUrls.map(url => del(url).catch(err => console.error('[analyze] suppression photo:', err?.message)))
    )
    await supabaseAdmin.from('room_analyses').update({ photo_url: null }).eq('id', analysisId)
  }

  return Response.json({ success: true, result: aiResult })
}
