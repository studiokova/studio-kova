// src/app/confidentialite/page.js

export const metadata = {
  title: "Politique de confidentialité — Studio Kova",
};

export default function Confidentialite() {
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
        .ml-content { max-width: 640px; margin: 0 auto; padding: 48px 24px 80px; }
        .ml-back { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: var(--gris); text-decoration: none; margin-bottom: 40px; transition: color 0.2s; }
        .ml-back:hover { color: var(--sauge-dk); }
        .ml-content h1 { font-family: "Playfair Display", serif; font-size: clamp(28px, 7vw, 36px); font-weight: 400; color: var(--sauge-dk); margin-bottom: 8px; }
        .ml-date { font-size: 12px; color: var(--gris); margin-bottom: 40px; }
        .ml-section { margin-bottom: 36px; }
        .ml-section h2 { font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: var(--cuivre); margin-bottom: 12px; }
        .ml-section p { font-size: 14px; font-weight: 300; color: var(--sauge-dk); line-height: 1.8; margin-bottom: 10px; }
        .ml-section ul { padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
        .ml-section ul li { font-size: 14px; font-weight: 300; color: var(--sauge-dk); line-height: 1.7; padding-left: 16px; position: relative; }
        .ml-section ul li::before { content: "✓"; position: absolute; left: 0; color: var(--sauge-lt); font-size: 11px; }
        .ml-divider { height: 1px; background: var(--gris-clair); margin: 36px 0; }
        .ml-footer { padding: 20px 24px; text-align: center; font-size: 11px; color: var(--gris); border-top: 1px solid var(--gris-clair); opacity: 0.7; }
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

        <h1>Politique de confidentialité</h1>
        <p className="ml-date">Dernière mise à jour : mai 2025</p>

        <div className="ml-section">
          <h2>Qui sommes-nous</h2>
          <p>Studio Kova est un service de conseil en décoration d'intérieur édité par Clémence Laurent, 41500 Mer, France. Contact : hello@studiokova.fr</p>
        </div>

        <div className="ml-divider"></div>

        <div className="ml-section">
          <h2>Données collectées</h2>
          <p>Lorsque vous laissez votre email sur ce site, nous collectons uniquement :</p>
          <ul>
            <li>Votre adresse email</li>
            <li>L'offre qui vous intéresse</li>
            <li>La date d'inscription</li>
          </ul>
          <p>Aucune autre donnée personnelle n'est collectée. Nous n'utilisons pas de cookies de tracking.</p>
        </div>

        <div className="ml-divider"></div>

        <div className="ml-section">
          <h2>Utilisation des données</h2>
          <p>Votre email est utilisé exclusivement pour :</p>
          <ul>
            <li>Vous prévenir de l'ouverture de l'offre qui vous intéresse</li>
            <li>Vous envoyer des informations sur Studio Kova si vous y avez consenti</li>
          </ul>
          <p>Vos données ne sont jamais vendues ni partagées avec des tiers à des fins commerciales.</p>
        </div>

        <div className="ml-divider"></div>

        <div className="ml-section">
          <h2>Sous-traitants</h2>
          <p>Nous utilisons Brevo (anciennement Sendinblue) pour gérer l'envoi d'emails. Brevo est une société française conforme au RGPD. En savoir plus : brevo.com/fr/politique-de-confidentialite</p>
        </div>

        <div className="ml-divider"></div>

        <div className="ml-section">
          <h2>Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit d'opposition</li>
            <li>Droit à la portabilité</li>
          </ul>
          <p>Pour exercer ces droits : hello@studiokova.fr. Vous pouvez également vous désabonner à tout moment via le lien présent dans chaque email.</p>
        </div>

        <div className="ml-divider"></div>

        <div className="ml-section">
          <h2>Conservation des données</h2>
          <p>Vos données sont conservées jusqu'à votre désabonnement ou jusqu'à ce que vous demandiez leur suppression.</p>
        </div>

        <div className="ml-divider"></div>

        <div className="ml-section">
          <h2>Contact</h2>
          <p>Pour toute question relative à vos données personnelles : hello@studiokova.fr</p>
        </div>
      </div>

      <footer className="ml-footer">
        <a href="/mentions-legales">Mentions légales</a> · <a href="/confidentialite">Confidentialité</a>
      </footer>
    </>
  );
}