import Stripe from "stripe";
import { OFFERS } from "@/lib/config";
import { generateEventId } from "@/lib/metaHelpers";

const BASE  = OFFERS.surmesure.stripePerPiece;
const EXTRA = OFFERS.surmesure.stripePerPieceExtra;

export async function POST(request) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? new URL(request.url).origin;
  let rooms, utms;
  try {
    ({ rooms, utms } = await request.json());
    rooms = parseInt(rooms);
  } catch {
    return Response.json({ error: "Corps invalide" }, { status: 400 });
  }

  if (!rooms || rooms < 1 || rooms > 10) {
    return Response.json({ error: "Nombre de pièces invalide" }, { status: 400 });
  }

  const amount = (BASE + (rooms - 1) * EXTRA) * 100;
  const metaEventId = generateEventId();
  const u = utms || {};

  // Référence produit : product ID si défini, sinon product_data inline
  const productRef = process.env.STRIPE_PRODUCT_PREMIUM
    ? { product: process.env.STRIPE_PRODUCT_PREMIUM }
    : { product_data: { name: `Je vous confie mon intérieur — ${rooms} pièce${rooms > 1 ? "s" : ""}` } };

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            ...productRef,
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/premium/brief?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/offre-premium`,
      metadata: {
        rooms: String(rooms),
        meta_event_id: metaEventId,
        meta_value: String(amount / 100),
        utm_source: u.utm_source || '',
        utm_medium: u.utm_medium || '',
        utm_campaign: u.utm_campaign || '',
        utm_content: u.utm_content || '',
        utm_term: u.utm_term || '',
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err?.message);
    return Response.json({ error: "Erreur de paiement. Réessayez ou contactez-nous." }, { status: 500 });
  }
}
