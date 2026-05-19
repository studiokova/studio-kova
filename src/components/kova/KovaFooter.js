import Image from "next/image";
import CookieManageButton from "./CookieManageButton";

// full: version complète pour la homepage (tagline + liens de nav)
// version simple par défaut pour les autres pages
export default function KovaFooter({ full = false }) {
  return (
    <footer className="kova-footer">
      <div className="kova-footer__logo">
        <a href="/" aria-label="Studio Kova — accueil">
          <Image
            src="/logo-fond-vert.svg"
            alt="Studio Kova"
            width={220}
            height={70}
            priority
          />
        </a>
      </div>

      {full && (
        <p className="kova-footer__tagline">
          Conseil en décoration d&apos;appartement<br />personnalisé et accessible.
        </p>
      )}

      {full && (
        <div className="kova-footer__links">
          <a href="/#offres"      className="kova-footer__link">Les offres</a>
          <a href="/#process"     className="kova-footer__link">Comment ça marche</a>
          <a href="/#temoignages" className="kova-footer__link">Témoignages</a>
        </div>
      )}

      <a href="mailto:hello@studiokova.fr" className="kova-footer__email">
        hello@studiokova.fr
      </a>

      <a
        href="https://instagram.com/studiokova.fr"
        className="kova-footer__instagram"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
        @studiokova.fr
      </a>

      <div className="kova-footer__divider" />

      <div className="kova-footer__bottom">
        <span>© 2025 Studio Kova</span>
        <span>
          <a href="/mentions-legales">Mentions légales</a>
          {" · "}
          <a href="/confidentialite">Politique de confidentialité</a>
          {" · "}
          <CookieManageButton />
        </span>
      </div>
    </footer>
  );
}
