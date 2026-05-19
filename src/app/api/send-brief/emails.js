export function buildClientEmail({ nom, pieces, budget }) {
  const firstName = nom ? nom.split(' ')[0] : '';
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5EFE4;font-family:Helvetica,Arial,sans-serif;color:#2E4A3A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <tr><td style="padding:0 0 24px;">
          <span style="font-size:13px;font-weight:600;letter-spacing:0.12em;color:#2E4A3A;">STUDIO KOVA</span>
        </td></tr>

        <tr><td style="background:white;border-radius:12px;padding:28px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:0 0 20px;border-bottom:1px solid #D3D1C7;">
              <p style="margin:0;font-size:17px;font-weight:600;">Votre projet est lancé${firstName ? `, ${firstName}` : ''}.</p>
            </td></tr>
            <tr><td style="padding:20px 0;border-bottom:1px solid #D3D1C7;">
              <p style="margin:0;font-size:15px;line-height:1.6;">Je reviens vers vous sous 24h pour lancer votre projet.</p>
            </td></tr>
            <tr><td style="padding:16px 0;border-bottom:1px solid #D3D1C7;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#888780;">Pièce(s) concernée(s)</p>
              <p style="margin:0;font-size:15px;font-weight:500;">${pieces}</p>
            </td></tr>
            <tr><td style="padding:16px 0 0;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#888780;">Budget meuble</p>
              <p style="margin:0;font-size:15px;">${budget}</p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:24px 0 0;">
          <p style="font-size:14px;color:#2E4A3A;margin:0 0 8px;">Vous pouvez envoyer vos photos en réponse à cet email.</p>
          <p style="font-size:12px;color:#888780;margin:0;">Studio Kova · hello@studiokova.fr</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildInternalEmail({ nom, email, montant, sessionId, pieces, photosLink, style, budget }) {
  const stripeLink = sessionId
    ? `https://dashboard.stripe.com/payments/${sessionId}`
    : null;

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5EFE4;font-family:Helvetica,Arial,sans-serif;color:#2E4A3A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <tr><td style="padding:0 0 24px;">
          <span style="font-size:13px;font-weight:600;letter-spacing:0.12em;color:#2E4A3A;">STUDIO KOVA — NOUVEAU BRIEF</span>
        </td></tr>

        <tr><td style="background:white;border-radius:12px;padding:28px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:0 0 16px;border-bottom:1px solid #D3D1C7;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#888780;">Client</p>
              <p style="margin:0;font-size:15px;font-weight:500;">${nom || '—'} · ${email || '—'}</p>
            </td></tr>
            <tr><td style="padding:16px 0;border-bottom:1px solid #D3D1C7;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#888780;">Montant</p>
              <p style="margin:0;font-size:15px;">${montant ? `${montant}€` : '—'}</p>
            </td></tr>
            <tr><td style="padding:16px 0;border-bottom:1px solid #D3D1C7;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#888780;">Session Stripe</p>
              <p style="margin:0;font-size:14px;">${stripeLink ? `<a href="${stripeLink}" style="color:#B8612A;">${sessionId}</a>` : (sessionId || '—')}</p>
            </td></tr>
            <tr><td style="padding:16px 0;border-bottom:1px solid #D3D1C7;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#888780;">Pièce(s) concernée(s)</p>
              <p style="margin:0;font-size:15px;font-weight:500;">${pieces}</p>
            </td></tr>
            <tr><td style="padding:16px 0;border-bottom:1px solid #D3D1C7;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#888780;">Style en une phrase</p>
              <p style="margin:0;font-size:15px;">${style}</p>
            </td></tr>
            <tr><td style="padding:16px 0;border-bottom:1px solid #D3D1C7;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#888780;">Budget meuble</p>
              <p style="margin:0;font-size:15px;">${budget}</p>
            </td></tr>
            <tr><td style="padding:16px 0 0;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#888780;">Photos</p>
              <p style="margin:0;font-size:15px;">${photosLink || 'Non renseigné'}</p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:24px 0 0;text-align:center;">
          <p style="font-size:12px;color:#888780;margin:0;">Studio Kova · hello@studiokova.fr</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
