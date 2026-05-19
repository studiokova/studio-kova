import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return Response.json({ error: 'session_id requis' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const meta = session.metadata || {}
    const utms = {}
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      if (meta[key]) utms[key] = meta[key]
    }
    return Response.json({
      email: session.customer_details?.email || session.customer_email || null,
      rooms_count: parseInt(meta.rooms || '1', 10),
      meta_event_id: meta.meta_event_id || null,
      meta_value: parseFloat(meta.meta_value || '299'),
      utms,
    })
  } catch {
    return Response.json({ error: 'Session introuvable' }, { status: 404 })
  }
}
