// src/app/mentions-legales/page.js

export const metadata = {
  title: "Mentions légales — Studio Kova",
};

export default function MentionsLegales() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --craie: #F5EFE4;
          --cuivre: #B8612A;
          --sauge-dk: #2E4A3A;
          --sauge-lt: #6B9E7A;
          --gris: #888780;
          --gris-clair: #D3D1C7;
        }
        body { background: var(--craie); font-family: "DM Sans", sans-serif; color: var(--sauge-dk); -webkit-font-smoothing: antialiased; }
        .ml-nav {
          display: flex; align-items: center;
          padding: 0 24px; height: 58px;
          border-bottom: 1px solid rgba(211,209,199,0.5);
        }
        .ml-nav a { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logotype { display: flex; flex-direction: column; line-height: 1; gap: 1px; }
        .nav-logotype .studio { font-size: 7.5px; font-weight: 500; letter-spacing: 0.2em; color: var(--sauge-lt); text-transform: uppercase; }
        .nav-logotype .kova { font-size: 19px; font-weight: 300; letter-spacing: 0.03em; color: var(--sauge-dk); }
        .ml-content {
          max-width: 640px; margin: 0 auto;
          padding: 48px 24px 80px;
        }
        .ml-back {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; color: var(--gris); text-decoration: none;
          margin-bottom: 40px; transition: color 0.2s;
        }
        .ml-back:hover { color: var(--sauge-dk); }
        .ml-content h1 {
          font-family: "Playfair Display", serif;
          font-size: clamp(28px, 7vw, 36px); font-weight: 400;
          color: var(--sauge-dk); margin-bottom: 40px;
        }
        .ml-section { margin-bottom: 36px; }
        .ml-section h2 {
          font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--cuivre); margin-bottom: 12px;
        }
        .ml-section p, .ml-section address {
          font-size: 14px; font-weight: 300; color: var(--sauge-dk);
          line-height: 1.8; font-style: normal;
        }
        .ml-divider { height: 1px; background: var(--gris-clair); margin: 36px 0; }
        .ml-footer {
          padding: 20px 24px; text-align: center;
          font-size: 11px; color: var(--gris);
          border-top: 1px solid var(--gris-clair); opacity: 0.7;
        }
        .ml-footer a { color: var(--gris); text-decoration: none; }
        .ml-footer a:hover { text-decoration: underline; }
      `}</style>

      <nav className="ml-nav">
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

      <div className="ml-content">
        <a href="/" className="ml-back">← Retour à l'accueil</a>

        <h1>Mentions légales</h1>

        <div className="ml-section">
          <h2>Éditeur du site</h2>
          <address>
            Clémence Laurent<br />
            41500 Mer, France<br />
            Email : hello@studiokova.fr<br />
            Site : studiokova.fr
          </address>
        </div>

        <div className="ml-divider"></div>

        <div className="ml-section">
          <h2>Activité</h2>
          <p>Studio Kova est une activité de conseil en décoration d'intérieur exercée à titre individuel.</p>
        </div>

        <div className="ml-divider"></div>

        <div className="ml-section">
          <h2>Hébergement</h2>
          <address>
            Vercel Inc.<br />
            440 N Barranca Ave #4133<br />
            Covina, CA 91723, États-Unis<br />
            vercel.com
          </address>
        </div>

        <div className="ml-divider"></div>

        <div className="ml-section">
          <h2>Propriété intellectuelle</h2>
          <p>L'ensemble du contenu de ce site (textes, visuels, logo) est la propriété exclusive de Studio Kova. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>
        </div>

        <div className="ml-divider"></div>

        <div className="ml-section">
          <h2>Contact</h2>
          <p>Pour toute question : hello@studiokova.fr</p>
        </div>
      </div>

      <footer className="ml-footer">
        <a href="/mentions-legales">Mentions légales</a> · <a href="/confidentialite">Confidentialité</a>
      </footer>
    </>
  );
}