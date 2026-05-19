// src/components/ComingSoon.js
"use client";
import { useState } from "react";
import KovaNav    from "@/components/kova/KovaNav";
import KovaFooter from "@/components/kova/KovaFooter";

export default function ComingSoon({ offre, titre, description, couleur }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, offre }),
      });
      if (!res.ok) { setStatus("error"); return; }
      const data = await res.json();
      setStatus(data.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  const accentColor = couleur === "cuivre" ? "#B8612A" : "#3D6B52";
  const accentBg = couleur === "cuivre" ? "rgba(184,97,42,0.08)" : "rgba(61,107,82,0.08)";

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --craie: #F5EFE4;
          --cuivre: #B8612A;
          --sauge-md: #3D6B52;
          --sauge-dk: #2E4A3A;
          --sauge-lt: #6B9E7A;
          --ocre: #E8C97A;
          --gris: #888780;
          --gris-clair: #D3D1C7;
        }
        html, body { height: 100%; }
        body { background: var(--craie); font-family: "DM Sans", sans-serif; color: var(--sauge-dk); -webkit-font-smoothing: antialiased; }

        .cs-wrap { min-height: 100svh; display: flex; flex-direction: column; }

        .cs-main {
          flex: 1;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 48px 24px 40px;
          text-align: center;
        }

        .cs-eyebrow {
          font-size: 9px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--gris); margin-bottom: 24px;
          display: flex; align-items: center; gap: 8px;
        }
        .cs-eyebrow::before, .cs-eyebrow::after {
          content: ""; display: block; width: 20px; height: 1px; background: var(--gris-clair);
        }

        .cs-h1 {
          font-family: "Playfair Display", serif;
          font-size: clamp(32px, 9vw, 46px); font-weight: 400; line-height: 1.15;
          color: var(--sauge-dk); margin-bottom: 14px;
        }
        .cs-h1 em { font-style: italic; }

        .cs-desc {
          font-size: 15px; font-weight: 300; color: var(--gris);
          line-height: 1.7; margin-bottom: 36px; max-width: 300px;
        }

        .cs-form {
          width: 100%; max-width: 340px;
          background: #2E4A3A; border-radius: 16px; padding: 28px;
        }

        .cs-input {
          width: 100%; padding: 14px; border-radius: 8px;
          border: none; background: #F5EFE4;
          font-family: "DM Sans", sans-serif; font-size: 14px; color: var(--sauge-dk);
          outline: none; display: block; margin-bottom: 10px;
        }
        .cs-input::placeholder { color: #888780; }

        .cs-submit {
          width: 100%; padding: 14px; border-radius: 999px;
          background: #B8612A; color: white;
          font-family: "DM Sans", sans-serif; font-size: 14.5px; font-weight: 500;
          border: none; cursor: pointer; display: block; transition: opacity 0.18s;
          margin-bottom: 14px;
        }
        .cs-submit:hover { opacity: 0.9; }
        .cs-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .cs-consent {
          font-size: 11px; font-weight: 300; color: rgba(245,239,228,0.55);
          line-height: 1.6; text-align: center;
        }
        .cs-consent a { color: rgba(245,239,228,0.55); text-decoration: underline; }

        .cs-success { text-align: center; }
        .cs-success-icon { font-size: 24px; margin-bottom: 12px; color: #E8C97A; }
        .cs-success h3 {
          font-family: "Playfair Display", serif; font-size: 18px; font-weight: 400;
          color: #F5EFE4; margin-bottom: 6px;
        }
        .cs-success p { font-size: 13.5px; font-weight: 300; color: rgba(245,239,228,0.7); line-height: 1.6; }

        .cs-error { font-size: 13px; color: #ffb3a0; margin-top: 8px; text-align: center; }

        .cs-back {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 400; color: var(--gris);
          text-decoration: none; margin-top: 28px;
          transition: color 0.2s;
        }
        .cs-back:hover { color: var(--sauge-dk); }

      `}</style>

      <div className="cs-wrap">

        <KovaNav showBack backLabel="Accueil" backHref="/" />

        <main className="cs-main">

          <div className="cs-eyebrow">Bientôt disponible</div>

          <h1 className="cs-h1">
            <em style={{ color: accentColor }}>{titre}</em>
          </h1>
          <p className="cs-desc">{description}</p>

          <div className="cs-form">
            {status === "success" ? (
              <div className="cs-success">
                <div className="cs-success-icon">✦</div>
                <h3>C'est noté.</h3>
                <p>Je vous préviens dès que c'est ouvert.<br />Merci de votre confiance.</p>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  className="cs-input"
                  placeholder="votre@email.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  className="cs-submit"
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Envoi..." : "Je veux être prévenu →"}
                </button>
                {status === "error" && <p className="cs-error">Une erreur s'est produite, réessayez.</p>}
                <p className="cs-consent">
                  Pas de spam. Désabonnement en un clic.{" "}
                  <a href="/confidentialite">Confidentialité</a>.
                </p>
              </>
            )}
          </div>

          <a href="/" className="cs-back">← Retour à l'accueil</a>

        </main>

        <KovaFooter />

      </div>
    </>
  );
}