import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { addContactToList, removeContactFromList } from '@/lib/brevo'
import { sendMetaEvent } from '@/lib/metaCapi'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

function extractUtmsFromMetadata(metadata) {
  const utms = {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    if (metadata[key]) utms[key] = metadata[key]
  }
  return utms
}

export async function POST(request) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('[webhook] Signature invalide:', err?.message)
    return Response.json({ error: 'Signature invalide' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return Response.json({ received: true })
  }

  const session = event.data.object
  const { customer_email, payment_intent, metadata } = session

  // ─── Sur-Mesure ───────────────────────────────────────────────────────────
  if (metadata.rooms) {
    const metaEventId = metadata.meta_event_id
    const metaValue = parseFloat(metadata.meta_value || '299')
    const utmsSurmesure = extractUtmsFromMetadata(metadata)
    if (metaEventId) {
      sendMetaEvent({
        eventName: 'Purchase',
        eventId: metaEventId,
        email: session.customer_details?.email || customer_email,
        externalId: session.customer_details?.email || customer_email,
        value: metaValue,
        currency: 'EUR',
        eventSourceUrl: 'https://studiokova.fr/surmesure',
        customData: {
          content_name: 'Sur-Mesure Studio Kova',
          content_category: 'sur-mesure',
          content_ids: [`surmesure_${metaValue}`],
          num_items: metadata.rooms || 1,
          ...utmsSurmesure,
        },
      }).catch(err => console.error('[Meta CAPI Purchase Premium]', err))
    } else {
      console.warn('[Meta CAPI Purchase Premium] meta_event_id absent du metadata Stripe')
    }
    return Response.json({ received: true })
  }

  // ─── Analyse 69€ ─────────────────────────────────────────────────────────
  const roomAnalysisId = metadata.room_analysis_id
  if (!roomAnalysisId) {
    console.error('[webhook] room_analysis_id manquant dans les métadonnées')
    return Response.json({ error: 'room_analysis_id manquant' }, { status: 400 })
  }

  // Récupère le profil style (peut être null si la cliente n'a pas fait le quiz)
  const { data: styleProfile } = await supabaseAdmin
    .from('style_profiles')
    .select('*')
    .eq('email', customer_email)
    .maybeSingle()

  // Passe la ligne de 'pending' à 'paid'.
  // .eq('status', 'pending') rend l'UPDATE idempotent : si Stripe rejoue l'événement,
  // la ligne est déjà au-delà de 'pending' et aucune ligne n'est modifiée.
  const { data: updatedAnalysis } = await supabaseAdmin
    .from('room_analyses')
    .update({
      stripe_payment_id: payment_intent,
      style_profile_snap: styleProfile ?? null,
      status: 'paid',
    })
    .eq('id', roomAnalysisId)
    .eq('status', 'pending')
    .select('id')
    .single()

  if (!updatedAnalysis) {
    // Ligne absente ou déjà au-delà de 'pending' — événement déjà traité, on ignore.
    console.warn('[webhook] Mise à jour ignorée (ligne déjà traitée ou absente):', roomAnalysisId)
    return Response.json({ received: true })
  }

  // Inscrit dans la liste transactionnelle analyse
  addContactToList(customer_email, process.env.BREVO_LIST_ANALYSIS, { OFFRE: 'analysis' })

  // Retire de la liste marketing quiz (la personne a converti)
  removeContactFromList(customer_email, process.env.BREVO_LIST_QUIZZ_MARKETING)

  // Si consentement marketing, ajoute à la liste marketing analyse
  if (styleProfile?.marketing_consent) {
    addContactToList(customer_email, process.env.BREVO_LIST_ANALYSIS_MARKETING, { OFFRE: 'analysis' })
  }

  // Déclenche l'analyse IA (awaité pour éviter que Vercel tue la fonction avant l'appel)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  await fetch(`${baseUrl}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ analysisId: updatedAnalysis.id }),
  }).catch((err) => console.error('[webhook] Erreur déclenchement analyse:', err?.message))

  const metaEventId = session.metadata?.meta_event_id
  const utmsAnalyse = extractUtmsFromMetadata(session.metadata || {})
  if (metaEventId) {
    sendMetaEvent({
      eventName: 'Purchase',
      eventId: metaEventId,
      email: session.customer_details?.email || session.customer_email,
      externalId: session.customer_details?.email || session.customer_email,
      value: 69,
      currency: 'EUR',
      eventSourceUrl: 'https://studiokova.fr/analyse',
      customData: {
        content_name: 'Analyse photo 69€',
        content_category: 'analyse',
        content_ids: ['analyse_69'],
        ...utmsAnalyse,
      },
    }).catch(err => console.error('[Meta CAPI Purchase 69]', err))
  } else {
    console.warn('[Meta CAPI Purchase 69] meta_event_id absent du metadata Stripe')
  }

  return Response.json({ received: true })
}
