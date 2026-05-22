import { sendTransactionalEmail } from '@/lib/brevo';
import { sendMetaEvent } from '@/lib/metaCapi';
import { getClientIp, getClientUserAgent, getFbp, getFbc } from '@/lib/metaHelpers';

const QUIZ_TEMPLATE_ID = 2;

function buildEmailParams({ name, axes, palette, text, actions }) {
  const cta = { label: "Je transforme ma pièce →", href: "https://studiokova.fr/analyse" };

  const swatches = palette
    .map(
      ({ color, name: colorName }) => `<td align="center" style="padding:0 14px;">
        <div style="width:60px;height:60px;border-radius:50%;background:${color};border:1px solid rgba(0,0,0,0.08);margin:0 auto 8px;"></div>
        <span style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#888780;">${colorName.charAt(0).toUpperCase() + colorName.slice(1)}</span>
      </td>`
    )
    .join("");

  const actionItems = actions
    .map(
      (a, i) => `<tr>
        <td style="padding:6px 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#2E4A3A;line-height:1.65;">${i + 1}.&nbsp;&nbsp;${a}</td>
      </tr>`
    )
    .join("");

  const contenu = `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 32px;">
  <tr>${swatches}</tr>
</table>
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 32px;">
  <tr>
    <td style="background:white;border-radius:16px;padding:28px;">
      <p style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.75;color:#2E4A3A;margin:0;">${text}</p>
    </td>
  </tr>
</table>
<table cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td style="padding:0 0 14px;">
      <h3 style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:400;color:#2E4A3A;margin:0;">Vos 3 premières actions</h3>
    </td>
  </tr>
  ${actionItems}
</table>`;

  return {
    titre: name,
    sous_titre: axes,
    contenu,
    cta_url: cta.href,
    cta_texte: cta.label,
  };
}

export async function POST(request) {
  const { email, offre, attributes: extraAttributes, profile, budget, meta_event_id, utms } = await request.json();

  if (!email || !email.includes("@")) {
    return Response.json({ error: "Email invalide" }, { status: 400 });
  }

  try {
    // 1. Créer / mettre à jour le contact Brevo
    const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [offre === "quiz" ? 5 : parseInt(process.env.BREVO_LIST_ID)],
        attributes: {
          OFFRE_INTERET: offre,
          ...extraAttributes,
        },
        updateEnabled: true,
      }),
    });

    if (!contactRes.ok && contactRes.status !== 204) {
      const err = await contactRes.json();
      console.error("Brevo contact error:", err);
      return Response.json({ error: "Erreur Brevo" }, { status: 500 });
    }

    // 2. Envoyer l'email transactionnel (quiz uniquement)
    if (offre === "quiz" && profile) {
      const params = buildEmailParams({ ...profile, budget });
      await sendTransactionalEmail(email, QUIZ_TEMPLATE_ID, params);
    }

    if (meta_event_id) {
      sendMetaEvent({
        eventName: 'Lead',
        eventId: meta_event_id,
        email,
        externalId: email,
        eventSourceUrl: request.headers.get('referer') || 'https://studiokova.fr/quiz',
        clientIpAddress: getClientIp(request),
        clientUserAgent: getClientUserAgent(request),
        fbp: getFbp(request),
        fbc: getFbc(request),
        customData: {
          content_name: 'Quiz Studio Kova',
          content_category: profile?.name,
          ...(utms || {}),
        },
      }).catch(err => console.error('[Meta CAPI Lead]', err));
    } else {
      console.warn('[Meta CAPI] meta_event_id absent - événement Lead non envoyé');
    }

    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
