import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return Response.json({ error: 'session_id requis' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return Response.json({ error: 'Paiement non confirmé' }, { status: 404 });
    }

    return Response.json({
      email: session.customer_details?.email || session.customer_email,
      meta_event_id: session.metadata?.meta_event_id,
      amount_total: session.amount_total,
    });
  } catch (err) {
    console.error('[checkout/session]', err?.message);
    return Response.json({ error: 'Session introuvable' }, { status: 404 });
  }
}
