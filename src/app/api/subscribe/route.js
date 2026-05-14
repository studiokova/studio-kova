function buildEmailHtml({ name, axes, palette, text, actions, budget }) {
  const cta =
    budget === "Moins de 200€"
      ? { label: "Découvrir l'offre gratuite →", href: "https://www.studiokova.fr/" }
      : budget === "200-500€"
      ? { label: "Je transforme ma pièce, 69€ →", href: "https://www.studiokova.fr/analyse" }
      : { label: "Je vous confie mon intérieur, à partir de 299€ →", href: "https://www.studiokova.fr/surmesure" };

  const swatches = palette
    .map(
      ({ color, name: colorName }) => `
      <td align="center" style="padding:0 14px;">
        <div style="width:60px;height:60px;border-radius:50%;background:${color};border:1px solid rgba(0,0,0,0.08);margin:0 auto 8px;"></div>
        <span style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#888780;">${colorName.charAt(0).toUpperCase() + colorName.slice(1)}</span>
      </td>`
    )
    .join("");

  const actionItems = actions
    .map(
      (a, i) => `
      <tr>
        <td style="padding:6px 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#2E4A3A;line-height:1.65;">
          ${i + 1}.&nbsp;&nbsp;${a}
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Votre profil déco Studio Kova</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:#F5EFE4;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5EFE4;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

          <!-- Logo / brand -->
          <tr>
            <td align="center" style="padding:0 0 36px;">
              <div style="text-align:center;">
                <svg viewBox="-14 -14 28 28" width="32" height="32" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;margin-right:8px;">
                  <rect transform="translate(0,-8) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#B8612A"/>
                  <rect transform="translate(8,0) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#2E4A3A"/>
                  <rect transform="translate(-8,0) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#E8C97A"/>
                  <rect transform="translate(0,8) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#6B9E7A"/>
                </svg>
                <span style="font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;letter-spacing:0.12em;color:#2E4A3A;vertical-align:middle;">STUDIO KOVA</span>
              </div>
            </td>
          </tr>

          <!-- Profile name -->
          <tr>
            <td align="center" style="padding:0 0 8px;">
              <h1 style="font-family:'Playfair Display',Georgia,'Times New Roman',serif;font-style:italic;font-size:38px;font-weight:400;color:#2E4A3A;margin:0;line-height:1.15;">${name}</h1>
            </td>
          </tr>

          <!-- Axes -->
          <tr>
            <td align="center" style="padding:0 0 36px;">
              <p style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#888780;letter-spacing:0.08em;margin:0;">${axes}</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 0 36px;">
              <div style="height:0.5px;background:#D3D1C7;"></div>
            </td>
          </tr>

          <!-- Palette -->
          <tr>
            <td align="center" style="padding:0 0 40px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>${swatches}</tr>
              </table>
            </td>
          </tr>

          <!-- Profile text -->
          <tr>
            <td style="background:white;border-radius:16px;padding:28px 28px;">
              <p style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.75;color:#2E4A3A;margin:0;">${text}</p>
            </td>
          </tr>

          <!-- Actions title -->
          <tr>
            <td style="padding:36px 0 14px;">
              <h3 style="font-family:'Playfair Display',Georgia,'Times New Roman',serif;font-size:20px;font-weight:400;color:#2E4A3A;margin:0;">Vos 3 premières actions</h3>
            </td>
          </tr>

          <!-- Actions list -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${actionItems}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:40px 0 0;">
              <a href="${cta.href}" style="display:inline-block;padding:18px 36px;background:#2E4A3A;color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;text-decoration:none;border-radius:50px;">${cta.label}</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:48px 0 0;">
              <p style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#888780;margin:0;">
                Studio Kova&nbsp;·&nbsp;<a href="mailto:hello@studiokova.fr" style="color:#888780;text-decoration:none;">hello@studiokova.fr</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request) {
  const { email, offre, attributes: extraAttributes, profile, budget } = await request.json();

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
      const htmlContent = buildEmailHtml({ ...profile, budget });

      const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { name: "Studio Kova", email: "hello@studiokova.fr" },
          to: [{ email }],
          subject: "Votre profil déco Studio Kova",
          htmlContent,
        }),
      });

      if (!emailRes.ok) {
        const err = await emailRes.json();
        console.error("Brevo transactional error:", err);
        // Le contact est créé — on ne bloque pas la réponse
      }
    }

    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
