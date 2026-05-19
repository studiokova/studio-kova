"use client";
import KovaLogo from "./KovaLogo";

// showBack: affiche le bouton retour à droite
// backLabel: texte du lien retour (défaut "Retour")
// backHref: href du lien retour (si absent → history.back())
// dark: variante fond --sauge-dk
export default function KovaNav({ showBack = false, backLabel = "Retour", backHref, dark }) {
  const logoVariant = dark ? "light" : "dark";

  function handleBack() {
    if (backHref) {
      window.location.href = backHref;
    } else {
      window.history.back();
    }
  }

  const backEl = showBack ? (
    backHref ? (
      <a href={backHref} className="kova-nav__back">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {backLabel}
      </a>
    ) : (
      <button onClick={handleBack} className="kova-nav__back">
        ← {backLabel}
      </button>
    )
  ) : (
    <span />
  );

  return (
    <nav className={`kova-nav${dark ? " kova-nav--dark" : ""}`}>
      {backEl}
      <KovaLogo variant={logoVariant} size={28} href="/" />
    </nav>
  );
}
