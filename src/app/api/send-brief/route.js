import Stripe from 'stripe';
import { saveBrief } from '@/lib/notion';
import { addContactToList } from '@/lib/brevo';
import { buildClientEmail, buildInternalEmail } from './emails';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function sendBrevoEmail({ to, subject, htmlContent }) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: 'Studio Kova', email: process.env.NOTIFICATION_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Brevo email error: ${err.message || 'unknown'}`);
  }
}

export async function POST(request) {
  const { sessionId, pieces, photosLink, style, budget } = await request.json();

  if (!pieces || !style || !budget) {
    return Response.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  // 1. Retrieve Stripe session info
  let stripeEmail = '';
  let stripeNom = '';
  let montant = 0;

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      stripeEmail = session.customer_details?.email || '';
      stripeNom = session.customer_details?.name || '';
      montant = session.amount_total ? session.amount_total / 100 : 0;
    } catch (e) {
      console.error('Stripe retrieve error:', e.message);
    }
  }

  // 2. Save to Notion (non-blocking)
  saveBrief({ nom: stripeNom, email: stripeEmail, montant, sessionId, pieces, photosLink, style, budget })
    .catch((e) => console.error('Notion save error:', e.message));

  // 3. Add to Brevo premium list (non-blocking)
  addContactToList(stripeEmail, process.env.BREVO_LIST_PREMIUM, { PRENOM: stripeNom })
    .catch((e) => console.error('Brevo contact error:', e.message));

  // 4 & 5. Send emails
  try {
    const emailTasks = [
      sendBrevoEmail({
        to: process.env.NOTIFICATION_EMAIL,
        subject: `Nouveau brief - ${pieces} - ${budget}`,
        htmlContent: buildInternalEmail({ nom: stripeNom, email: stripeEmail, montant, sessionId, pieces, photosLink, style, budget }),
      }),
    ];

    if (stripeEmail) {
      emailTasks.push(
        sendBrevoEmail({
          to: stripeEmail,
          subject: 'Votre projet Studio Kova est lancé ✓',
          htmlContent: buildClientEmail({ nom: stripeNom, pieces, budget }),
        })
      );
    }

    await Promise.all(emailTasks);
    return Response.json({ success: true });
  } catch (e) {
    console.error('Email send error:', e.message);
    return Response.json({ error: 'Erreur envoi email' }, { status: 500 });
  }
}
