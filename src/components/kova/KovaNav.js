"use client";
import { useState } from "react";
import KovaLogo from "./KovaLogo";
import { track } from "@/lib/plausible";

// full: variante homepage — logo + liens nav + CTA
// showBack: bouton retour (pages intérieures)
// dark: fond --sauge-dk
export default function KovaNav({ showBack = false, backLabel = "Retour", backHref, dark, full }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleBack() {
    if (backHref) window.location.href = backHref;
    else window.history.back();
  }

  function closeMenu() { setMenuOpen(false); }

  if (full) {
    return (
      <>
        <nav className="kova-nav kova-nav--full">
          <KovaLogo variant="dark" size={28} href="/" />

          <ul className="kova-nav__links">
            <li><a href="/#pieces" className="kova-nav__link">Pièces</a></li>
            <li><a href="/#offres" className="kova-nav__link">Offres</a></li>
            <li>
              <a
                href="/blog"
                className="kova-nav__link"
                onClick={() => track("Clic blog header")}
              >
                Blog
              </a>
            </li>
            <li><a href="/quiz" className="kova-nav__link">Quiz</a></li>
          </ul>

          <div className="kova-nav__right">
            <a href="/analyse" className="kova-nav__cta">Analyse IA</a>
            <button
              className="kova-nav__burger"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="kova-nav__burger-line" />
              <span className="kova-nav__burger-line" />
              <span className="kova-nav__burger-line" />
            </button>
          </div>
        </nav>

        <div className={`kova-nav__drawer${menuOpen ? " kova-nav__drawer--open" : ""}`} aria-hidden={!menuOpen}>
          <a href="/#pieces" className="kova-nav__drawer-link" onClick={closeMenu}>Pièces</a>
          <a href="/#offres" className="kova-nav__drawer-link" onClick={closeMenu}>Offres</a>
          <a
            href="/blog"
            className="kova-nav__drawer-link"
            onClick={() => { track("Clic blog header"); closeMenu(); }}
          >
            Blog
          </a>
          <a href="/quiz" className="kova-nav__drawer-link" onClick={closeMenu}>Quiz</a>
          <div className="kova-nav__drawer-cta">
            <a href="/analyse" className="kova-nav__cta" style={{ width: "100%", justifyContent: "center" }} onClick={closeMenu}>
              Analyse IA
            </a>
          </div>
        </div>
      </>
    );
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
      <button onClick={handleBack} className="kova-nav__back">← {backLabel}</button>
    )
  ) : (
    <span />
  );

  return (
    <nav className={`kova-nav${dark ? " kova-nav--dark" : ""}`}>
      {backEl}
      <KovaLogo variant={dark ? "light" : "dark"} size={28} href="/" />
    </nav>
  );
}
