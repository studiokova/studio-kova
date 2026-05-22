import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Corps invalide' }, { status: 400 })
  }

  const {
    session_id, email, rooms_count, prenom, telephone, projet_phrase,
    style_validation, style_profile_snap, style_corrections, style_inputs, rooms,
  } = body

  if (!email) return Response.json({ error: 'email requis' }, { status: 400 })

  const { data: insertedBrief, error } = await supabaseAdmin
    .from('premium_briefs')
    .insert({
      email,
      stripe_payment_id: session_id,
      rooms_count: rooms_count || rooms?.length || 1,
      prenom,
      telephone,
      projet_phrase,
      style_validation,
      style_profile_snap,
      style_corrections,
      style_inputs,
      rooms,
      submitted_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) {
    console.error('[premium/brief] supabase error:', error.message)
    return Response.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        to: [{ email, name: prenom }],
        templateId: 12,
        params: { prenom },
      }),
    })
  } catch (err) {
    console.error('[premium/brief] brevo confirmation error:', err)
  }

  try {
    const brief = {
      id: insertedBrief?.id,
      email,
      stripe_payment_id: session_id,
      rooms_count: rooms_count || rooms?.length || 1,
      prenom,
      telephone,
      projet_phrase,
      style_validation,
      style_profile_snap,
      style_corrections,
      style_inputs,
      rooms,
    }
    const montant = brief.rooms_count === 1
      ? 299
      : 299 + (brief.rooms_count - 1) * 230
    const styleSummary = buildStyleSummary(brief)
    const roomsSummary = buildRoomsSummary(brief.rooms)

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; color: #2E4A3A; line-height: 1.6;">
        <div style="background: #2E4A3A; color: #F5EFE4; padding: 20px 30px;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 400;">
            Nouveau brief premium
          </h1>
          <p style="margin: 6px 0 0; font-size: 13px; color: #A8CCB8;">
            ${brief.prenom} · ${brief.rooms_count} pièce${brief.rooms_count > 1 ? 's' : ''} · ${montant}€
          </p>
        </div>

        <div style="padding: 24px 30px; background: #F5EFE4;">
          <h2 style="font-size: 14px; color: #B8612A; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">
            Contact
          </h2>
          <p style="margin: 0 0 4px;"><strong>${brief.prenom}</strong></p>
          <p style="margin: 0 0 4px;">${brief.email}</p>
          <p style="margin: 0;">${brief.telephone || 'Pas de téléphone'}</p>

          <h2 style="font-size: 14px; color: #B8612A; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0 8px;">
            Projet en une phrase
          </h2>
          <p style="margin: 0; font-style: italic;">${brief.projet_phrase}</p>

          <h2 style="font-size: 14px; color: #B8612A; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0 8px;">
            Style
          </h2>
          <div style="white-space: pre-line;">${styleSummary}</div>

          <h2 style="font-size: 14px; color: #B8612A; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0 8px;">
            Pièces
          </h2>
          <div style="white-space: pre-line;">${roomsSummary}</div>

          <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #D3D1C7;">
            <p style="margin: 0 0 12px; font-size: 12px; color: #888780;">Stripe : ${brief.stripe_payment_id}</p>
            <a href="https://studiokova.fr/admin/briefs/${brief.id}"
               style="display: inline-block; background: #B8612A; color: #F5EFE4; padding: 12px 24px; text-decoration: none; font-size: 13px; letter-spacing: 0.5px;">
              Voir le brief complet →
            </a>
          </div>
        </div>
      </div>
    `

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Studio Kova Brief', email: 'noreply@studiokova.fr' },
        to: [{ email: 'hello@studiokova.fr', name: 'Clémence' }],
        subject: `Nouveau brief premium - ${brief.prenom} · ${brief.rooms_count} pièce${brief.rooms_count > 1 ? 's' : ''}`,
        htmlContent: html,
      }),
    })
  } catch (err) {
    console.error('[premium/brief] brevo notif error:', err)
  }

  return Response.json({ success: true })
}

function buildStyleSummary(brief) {
  if (brief.style_profile_snap) {
    const profile = brief.style_profile_snap
    const validation = brief.style_validation === 'confirmed'
      ? 'confirmé tel quel'
      : `partiel - corrections : ${brief.style_corrections}`
    return `Quiz fait - Profil ${profile.style_name} (${validation})`
  }
  const s = brief.style_inputs || {}
  const inspirations = s.inspirations_url
    ? s.inspirations_url
    : `${(s.inspirations_photos || []).length} photos uploadées`
  return `Pas de quiz
Ambiance : ${(s.ambiance || []).join(', ')}
Couleurs : ${s.couleurs || 'non renseignées'}
Inspirations : ${inspirations}`
}

function buildRoomsSummary(rooms) {
  return (rooms || []).map((r, i) => {
    const garder = r.approche === 'ameliorer' && r.garder
      ? ` (garde : ${r.garder})`
      : ''
    return `Pièce ${i + 1} - ${r.type_piece}
Approche : ${r.approche}${garder}
Dérange : ${r.probleme}
Sentir : ${r.sentiment}
Budget : ${r.budget}
Contraintes : ${r.contraintes || 'aucune'}
Photos : ${(r.photos || []).length}`
  }).join('\n\n')
}
