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
  let roomContext
  try {
    roomContext = JSON.parse(metadata.room_context)
  } catch {
    console.error('[webhook] room_context invalide:', metadata.room_context)
    return Response.json({ error: 'room_context invalide' }, { status: 400 })
  }

  let styleContext = null
  try {
    if (metadata.style_context) styleContext = JSON.parse(metadata.style_context)
  } catch {
    console.error('[webhook] style_context invalide:', metadata.style_context)
  }

  const photoUrls = metadata.photo_urls

  // Récupère le profil style (peut être null si la cliente n'a pas fait le quiz)
  const { data: styleProfile } = await supabaseAdmin
    .from('style_profiles')
    .select('*')
    .eq('email', customer_email)
    .maybeSingle()

  // Insère l'analyse avec statut paid
  const { data: analysis, error: insertError } = await supabaseAdmin
    .from('room_analyses')
    .insert({
      email: customer_email,
      stripe_payment_id: payment_intent,
      photo_url: photoUrls,
      room_context: roomContext,
      style_context: styleContext,
      style_profile_snap: styleProfile ?? null,
      status: 'paid',
    })
    .select('id')
    .single()

  if (insertError || !analysis) {
    console.error('[webhook] Erreur insertion:', insertError?.message)
    return Response.json({ error: 'Erreur base de données' }, { status: 500 })
  }

  // Inscrit dans la liste transactionnelle analyse
  addContactToList(customer_email, process.env.BREVO_LIST_ANALYSIS, { OFFRE: 'analysis' })

  // Retire de la liste marketing quiz (la personne a converti)
  removeContactFromList(customer_email, process.env.BREVO_LIST_QUIZZ_MARKETING)

  // Si consentement marketing, ajoute à la liste marketing analyse
  if (styleProfile?.marketing_consent) {
    addContactToList(customer_email, process.env.BREVO_LIST_ANALYSIS_MARKETING, { OFFRE: 'analysis' })
  }

  // Déclenche l'analyse IA en fire-and-forget
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  fetch(`${baseUrl}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ analysisId: analysis.id }),
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
