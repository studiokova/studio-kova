// src/components/ComingSoon.js
"use client";
import { useState } from "react";

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

        .cs-nav {
          display: flex; align-items: center;
          padding: 0 24px; height: 58px;
          border-bottom: 1px solid rgba(211,209,199,0.5);
        }
        .cs-nav a { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logotype { display: flex; flex-direction: column; line-height: 1; gap: 1px; }
        .nav-logotype .studio { font-size: 7.5px; font-weight: 500; letter-spacing: 0.2em; color: var(--sauge-lt); text-transform: uppercase; }
        .nav-logotype .kova { font-size: 19px; font-weight: 300; letter-spacing: 0.03em; color: var(--sauge-dk); }

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

        .cs-form { width: 100%; max-width: 340px; }

        .cs-input {
          width: 100%; padding: 14px 16px; border-radius: 3px;
          border: 1px solid var(--gris-clair); background: white;
          font-family: "DM Sans", sans-serif; font-size: 14px; color: var(--sauge-dk);
          outline: none; transition: border-color 0.2s; margin-bottom: 10px;
        }
        .cs-input:focus { border-color: var(--sauge-md); }
        .cs-input::placeholder { color: var(--gris); }

        .cs-submit {
          width: 100%; padding: 14px 24px; border-radius: 3px;
          background: var(--cuivre); color: white;
          font-family: "DM Sans", sans-serif; font-size: 14.5px; font-weight: 500;
          border: none; cursor: pointer; transition: background 0.2s, transform 0.15s;
          margin-bottom: 12px;
        }
        .cs-submit:hover { background: #a3541f; transform: translateY(-1px); }
        .cs-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .cs-consent {
          font-size: 11px; font-weight: 300; color: var(--gris);
          line-height: 1.6; text-align: center;
        }
        .cs-consent a { color: var(--gris); text-decoration: underline; }

        .cs-success {
          padding: 24px 20px; border-radius: 8px;
          background: rgba(61,107,82,0.07);
          border: 1px solid rgba(61,107,82,0.15);
          text-align: center;
        }
        .cs-success-icon { font-size: 24px; margin-bottom: 12px; }
        .cs-success h3 {
          font-family: "Playfair Display", serif; font-size: 18px; font-weight: 400;
          color: var(--sauge-dk); margin-bottom: 6px;
        }
        .cs-success p { font-size: 13.5px; font-weight: 300; color: var(--gris); line-height: 1.6; }

        .cs-error { font-size: 13px; color: #c0392b; margin-top: 8px; text-align: center; }

        .cs-back {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 400; color: var(--gris);
          text-decoration: none; margin-top: 28px;
          transition: color 0.2s;
        }
        .cs-back:hover { color: var(--sauge-dk); }

        .cs-footer {
          padding: 20px 24px; text-align: center;
          font-size: 11px; color: var(--gris);
          border-top: 1px solid var(--gris-clair);
          opacity: 0.7;
        }
        .cs-footer a { color: var(--gris); text-decoration: none; }
        .cs-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="cs-wrap">

        <nav className="cs-nav">
          <a href="/">
            <svg width="26" height="26" viewBox="-14 -14 28 28" xmlns="http://www.w3.org/2000/svg">
              <rect transform="translate(0,-8) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#B8612A"/>
              <rect transform="translate(8,0) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#2E4A3A"/>
              <rect transform="translate(-8,0) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#E8C97A"/>
              <rect transform="translate(0,8) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#6B9E7A"/>
            </svg>
            <div className="nav-logotype">
              <span className="studio">Studio</span>
              <span className="kova">Kova</span>
            </div>
          </a>
        </nav>

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

        <footer className="cs-footer">
          <a href="/mentions-legales">Mentions légales</a> · <a href="/confidentialite">Confidentialité</a>
        </footer>

      </div>
    </>
  );
}