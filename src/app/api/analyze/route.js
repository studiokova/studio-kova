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
  const rc = roomContext || {}
  const sc = styleContext || {}

  const profileBlock = styleProfile ? `# Son profil style général - contexte de fond uniquement
Profil : ${styleProfile.style_name}
Tendances générales : ${styleProfile.ambiance_cible?.join(', ')}, ${styleProfile.couleurs_aimees?.join(', ')}, ${styleProfile.matieres_preferees?.join(', ')}
Note : ce profil reflète ses goûts généraux. Il sert UNIQUEMENT de départage quand les préférences exprimées pour cette pièce et les photos ne suffisent pas à trancher. Ne le cite jamais comme justification d'une recommandation : les seules justifications visibles dans le livrable sont les éléments des photos et les préférences exprimées pour cette pièce.

` : ''

  const casUsageBlock = {
    surfaces: `Cas d'usage : REFAIRE LES SURFACES (peinture, papier peint, murs, moulures).
Tu travailles UNIQUEMENT les surfaces. Le mobilier reste tel quel : ne propose jamais de le changer, de le déplacer ou de le repeindre. Tes 3 directions sont 3 partis pris de traitement des murs/surfaces.`,
    deco: `Cas d'usage : REFAIRE LA DÉCO (textiles, objets, luminaires, agencement).
Tu ne touches NI aux murs/surfaces NI aux gros meubles existants. Tu travailles la couche déco : textiles, luminaires, objets, disposition. Tes 3 directions sont 3 ambiances déco.`,
    tout: `Cas d'usage : TOUT REFAIRE / MEUBLER (surfaces + mobilier).
Périmètre complet : surfaces, mobilier, déco. Tes 3 directions sont 3 partis pris globaux pour la pièce.`,
  }[rc.cas_usage] || `Cas d'usage : non précisé. Propose 3 directions globales pour la pièce.`

  return `# Cette pièce - priorité absolue
Type de pièce : ${rc.type_piece}
${casUsageBlock}
Ce que la cliente veut GARDER (à ne jamais remettre en cause) : ${rc.garder || 'non précisé'}
Ses contraintes (locataire, budget serré, etc.) : ${rc.contraintes || 'non précisé'}
Ce qui la dérange le plus : "${rc.probleme || 'non précisé'}"
Budget : ${rc.budget}
Pourquoi elle fait cette analyse maintenant : ${rc.motivation || 'non précisé'}

# Ses préférences pour cette pièce - priorité haute
Ambiance souhaitée : ${sc.ambiance?.join(', ') || 'non précisé'}
Couleur qu'elle aime : ${sc.couleur_aimee || 'non précisé'}
Couleur qu'elle veut absolument éviter : ${sc.couleur_evitee || 'non précisé'}
Matières qu'elle aime : ${sc.matieres?.join(', ') || 'non précisé'}
Sa demande précise (si exprimée, à traiter en priorité) : ${sc.demande_precise || 'non précisé'}

${profileBlock}# Règles de recommandation
- Respecte STRICTEMENT le cas d'usage ci-dessus : ne sors jamais de son périmètre.
- Ne propose JAMAIS de modifier, déplacer ou remplacer un élément listé dans "ce que la cliente veut garder". Compose tes palettes et tes actions AUTOUR de ces éléments (par ex. une palette qui s'accorde avec un canapé conservé).
- Respecte les contraintes : si elle est locataire, privilégie le réversible ; si le budget est serré, priorise.
- Le diagnostic cite des éléments concrets visibles sur les photos (proportion, couleur existante, lumière, meuble identifiable).
- Toutes les palettes respectent la couleur à éviter.
- Tu proposes EXACTEMENT 3 directions : "Neutre" (sobre, sûr, peu de risque), "Médian" (un parti pris assumé mais accessible), "Coloré" (le plus affirmé). Chacune doit rester cohérente avec ses préférences et son cas d'usage.
- INTERDICTION ABSOLUE de nommer un produit, une marque, une enseigne ou une référence commerciale précise. Tu donnes des catégories, des matières, des couleurs, des principes — jamais "le canapé X de la marque Y". Les références précises sont une autre offre.
- Le coût estimé de chaque action est réaliste par rapport au budget : ${rc.budget}.
- La phrase clé décrit l'état final souhaité, pas un conseil.
- La palette de chaque direction représente l'harmonie complète de la pièce : les couleurs à appliquer ET, quand un élément coloré marquant est conservé (étagères, fauteuil, meuble visible sur les photos), sa couleur reprise telle quelle.
- Chaque couleur de palette porte un champ "statut" : "a_appliquer" si on la met en œuvre (peinture…), "existant" si c'est la couleur d'un élément déjà présent qu'on garde.
- Quand un élément coloré marquant existe et est conservé, intègre sa couleur dans la palette en "existant" pour ancrer la proposition dans la pièce réelle. Si la pièce n'a pas d'élément coloré marquant à reprendre, la palette peut être entièrement "a_appliquer" — ne force pas une couleur existante artificielle.
- INTERDICTION d'une couleur fantôme : toute couleur de la palette doit être soit utilisée dans au moins une action de la direction, soit une couleur d'un élément existant ("existant"). Aucune couleur décorative non rattachée.
- Chaque direction comporte 3 à 4 actions.
- N'utilise JAMAIS le tiret cadratin (—). Remplace-le par une virgule, un point ou une reformulation directe selon le contexte.

Réponds UNIQUEMENT en JSON valide, sans backticks, sans texte avant ou après :
{
  "cas_usage": "${rc.cas_usage || 'tout'}",
  "diagnostic": "2-3 phrases. Cite des éléments concrets de la photo : lumière, proportions, couleurs existantes.",
  "directions": [
    {
      "intitule": "Neutre",
      "description": "1-2 phrases décrivant l'esprit de cette direction.",
      "palette": [
        { "nom": "", "hex": "#000000", "usage": "Pour quoi et où dans la pièce", "statut": "a_appliquer" },
        { "nom": "", "hex": "#000000", "usage": "Couleur de l'élément existant conservé (ex. étagères, fauteuil)", "statut": "existant" }
      ],
      "actions": [{ "action": "Verbe d'action + quoi faire concrètement", "pourquoi": "Lien avec la photo ou la préférence", "cout_estime": "Fourchette réaliste en euros" }]
    },
    {
      "intitule": "Médian",
      "description": "1-2 phrases.",
      "palette": [{ "nom": "", "hex": "#000000", "usage": "", "statut": "a_appliquer" }],
      "actions": [{ "action": "", "pourquoi": "", "cout_estime": "" }]
    },
    {
      "intitule": "Coloré",
      "description": "1-2 phrases.",
      "palette": [{ "nom": "", "hex": "#000000", "usage": "", "statut": "a_appliquer" }],
      "actions": [{ "action": "", "pourquoi": "", "cout_estime": "" }]
    }
  ],
  "matieres": ["", "", ""],
  "a_eviter": ["", ""],
  "phrase_cle": "Une phrase qui décrit l'état final : ce que la pièce deviendra."
}`
}

function parseClaudeJson(text) {
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
  const parsed = JSON.parse(cleaned)
  if (!Array.isArray(parsed.directions) || parsed.directions.length !== 3) {
    throw new Error('Format invalide : 3 directions attendues')
  }
  return parsed
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
    max_tokens: 4000,
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
      subject: `Analyse échouée - ${analysisId}`,
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

  // 1. Génération PDF - attendue avant suppression des photos
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

  // 2. Notification interne - PDF à envoyer manuellement à la cliente
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY },
    body: JSON.stringify({
      sender: { name: 'Studio Kova', email: 'hello@studiokova.fr' },
      to: [{ email: 'hello@studiokova.fr' }],
      subject: `Nouvelle analyse prête - ${analysis.email}`,
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
