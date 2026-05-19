import Stripe from 'stripe';
import { OFFERS } from '@/lib/config';
import { generateEventId } from '@/lib/metaHelpers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Corps invalide' }, { status: 400 })
  }

  const { email, photoUrls, roomContext, styleContext, utms } = body

  if (!email || !photoUrls?.length || !roomContext || !styleContext) {
    return Response.json({ error: 'email, photoUrls, roomContext et styleContext sont requis' }, { status: 400 })
  }

  try {
    const metaEventId = generateEventId();
    const u = utms || {};

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: OFFERS.analyse.stripeId,
          quantity: 1,
        },
      ],
      metadata: {
        photo_urls: JSON.stringify(photoUrls),
        room_context: JSON.stringify(roomContext),
        style_context: JSON.stringify(styleContext),
        meta_event_id: metaEventId,
        utm_source: u.utm_source || '',
        utm_medium: u.utm_medium || '',
        utm_campaign: u.utm_campaign || '',
        utm_content: u.utm_content || '',
        utm_term: u.utm_term || '',
      },
      payment_intent_data: {
        metadata: {
          meta_event_id: metaEventId,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/analyse/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/analyse`,
    })

    return Response.json({ url: session.url })
  } catch (err) {
    console.error('[checkout]', err?.message)
    return Response.json({ error: 'Erreur de paiement. Réessayez ou contactez-nous.' }, { status: 500 })
  }
}
