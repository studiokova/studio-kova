"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addReveal = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

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
          --sauge-text: #A8CCB8;
          --gris: #888780;
          --gris-clair: #D3D1C7;
        }
        html { scroll-behavior: smooth; }
        body { background: var(--craie); font-family: "DM Sans", sans-serif; color: var(--sauge-dk); overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px; height: 58px;
          background: rgba(245,239,228,0.94);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(211,209,199,0.5);
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logotype { display: flex; flex-direction: column; line-height: 1; gap: 1px; }
        .nav-logotype .studio { font-size: 7.5px; font-weight: 500; letter-spacing: 0.2em; color: var(--sauge-lt); text-transform: uppercase; }
        .nav-logotype .kova { font-size: 19px; font-weight: 300; letter-spacing: 0.03em; color: var(--sauge-dk); }
        .hamburger { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; gap: 5px; padding: 6px; }
        .hamburger span { display: block; width: 22px; height: 1.5px; background: var(--sauge-dk); transition: all 0.3s ease; border-radius: 1px; }
        .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        .mobile-menu {
          position: fixed; top: 58px; left: 0; right: 0; z-index: 99;
          background: var(--craie);
          transform: translateY(-8px); opacity: 0; pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          border-bottom: 1px solid var(--gris-clair);
        }
        .mobile-menu.open { transform: translateY(0); opacity: 1; pointer-events: all; }
        .mobile-menu a {
          display: block; padding: 15px 24px;
          font-size: 14px; font-weight: 400; color: var(--sauge-dk); text-decoration: none;
          border-bottom: 1px solid rgba(211,209,199,0.5);
          transition: padding-left 0.2s, color 0.2s;
        }
        .mobile-menu a:last-child { border: none; }
        .mobile-menu a:hover { padding-left: 30px; color: var(--cuivre); }

        .hero {
          position: relative; height: 100svh; min-height: 620px;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 0 24px 52px; overflow: hidden; padding-top: 58px;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background-image: url("/hero.jpg");
          background-size: cover; background-position: center 25%;
          animation: zoomIn 14s ease-out both;
        }
        @keyframes zoomIn { from { transform: scale(1.06); } to { transform: scale(1.0); } }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(170deg, rgba(46,74,58,0.08) 0%, rgba(46,74,58,0.05) 35%, rgba(46,74,58,0.65) 70%, rgba(46,74,58,0.92) 100%);
        }
        .hero-content { position: relative; z-index: 2; }
        .hero h1 {
          font-family: "Playfair Display", serif;
          font-size: clamp(34px, 9.5vw, 48px); font-weight: 400; line-height: 1.15;
          color: var(--craie); margin-bottom: 14px;
          animation: fadeUp 0.7s 0.3s both;
        }
        .hero h1 em { font-style: italic; color: var(--ocre); }
        .hero-sub {
          font-size: 16px; font-weight: 300; line-height: 1.65;
          color: rgba(245,239,228,0.85); margin-bottom: 30px;
          animation: fadeUp 0.7s 0.5s both;
        }
        .hero-ctas { display: flex; flex-direction: column; gap: 11px; animation: fadeUp 0.7s 0.65s both; }

        .btn-primary {
          display: flex; align-items: center; justify-content: center;
          background: var(--cuivre); color: #fff;
          padding: 15px 24px; border-radius: 3px;
          font-family: "DM Sans", sans-serif; font-size: 14.5px; font-weight: 500;
          text-decoration: none; transition: background 0.2s, transform 0.15s;
          border: none; cursor: pointer;
        }
        .btn-primary:hover { background: #a3541f; transform: translateY(-1px); }
        .btn-ghost {
          display: flex; align-items: center; justify-content: center;
          background: transparent; color: rgba(245,239,228,0.9);
          padding: 14px 24px; border-radius: 3px;
          font-family: "DM Sans", sans-serif; font-size: 14px; font-weight: 400;
          text-decoration: none;
          border: 1px solid rgba(245,239,228,0.35);
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-ghost:hover { background: rgba(245,239,228,0.08); border-color: rgba(245,239,228,0.6); }
        .btn-dark {
          display: flex; align-items: center; justify-content: center;
          background: var(--sauge-dk); color: var(--craie);
          padding: 15px 24px; border-radius: 3px;
          font-family: "DM Sans", sans-serif; font-size: 14.5px; font-weight: 500;
          text-decoration: none; transition: background 0.2s, transform 0.15s;
          border: none; cursor: pointer;
        }
        .btn-dark:hover { background: #3a5e49; transform: translateY(-1px); }

        .section-offres { padding: 72px 0 64px; background: var(--craie); }
        .section-header { padding: 0 24px; margin-bottom: 36px; }
        .section-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--cuivre); margin-bottom: 10px;
        }
        .section-eyebrow::before { content: ""; display: block; width: 24px; height: 1px; background: var(--cuivre); }
        .section-offres h2 {
          font-family: "Playfair Display", serif;
          font-size: clamp(26px, 7vw, 36px); font-weight: 400; line-height: 1.2;
          color: var(--sauge-dk);
        }
        .cards-wrapper { display: flex; flex-direction: column; gap: 16px; padding: 0 20px; }
        .card {
          background: white; border-radius: 8px; overflow: hidden;
          border: 1px solid var(--gris-clair);
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(46,74,58,0.1); }
        .card-img { height: 190px; background-size: cover; background-position: center; position: relative; }
        .card-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(46,74,58,0.55) 0%, transparent 55%);
        }
        .card-badge {
          position: absolute; top: 12px; left: 12px;
          font-size: 9px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 4px 8px; border-radius: 2px;
        }
        .badge-free { background: var(--ocre); color: var(--sauge-dk); }
        .badge-ia { background: var(--cuivre); color: white; }
        .badge-premium { background: var(--sauge-dk); color: var(--craie); }
        .card-price {
          position: absolute; bottom: 12px; right: 14px;
          font-family: "Playfair Display", serif; font-size: 24px; font-weight: 400;
          color: white; line-height: 1;
        }
        .card-price small { font-family: "DM Sans", sans-serif; font-size: 11px; font-weight: 300; opacity: 0.8; }
        .card-body { padding: 20px 20px 24px; }
        .card-title {
          font-family: "Playfair Display", serif; font-size: 20px; font-weight: 400;
          color: var(--sauge-dk); margin-bottom: 8px;
        }
        .card-desc { font-size: 13.5px; font-weight: 300; color: var(--gris); line-height: 1.7; margin-bottom: 18px; }
        .card-features { list-style: none; margin-bottom: 22px; display: flex; flex-direction: column; gap: 8px; }
        .card-features li {
          display: flex; align-items: flex-start; gap: 9px;
          font-size: 13px; font-weight: 400; color: var(--sauge-dk);
        }
        .card-features li::before { content: "✓"; color: var(--sauge-lt); font-size: 11px; flex-shrink: 0; margin-top: 2px; }
        .card.featured { border-color: var(--cuivre); border-width: 1.5px; }

        .photo-sep {
          height: 260px;
          background-image: url("/section.jpg");
          background-size: cover; background-position: center 40%;
        }

        .section-temoignages { padding: 72px 24px 64px; background: var(--craie); }
        .section-temoignages h2 {
          font-family: "Playfair Display", serif;
          font-size: clamp(26px, 6.5vw, 34px); font-weight: 400;
          color: var(--sauge-dk); margin-bottom: 32px;
        }
        .temoignages-grid { display: flex; flex-direction: column; gap: 16px; }
        .temoignage {
          background: white; border-radius: 8px; padding: 26px 22px 22px;
          border: 1px solid var(--gris-clair); position: relative; overflow: hidden;
        }
        .temoignage::before {
          content: "«";
          font-family: "Playfair Display", serif; font-size: 72px; font-style: italic;
          color: var(--ocre); opacity: 0.18;
          position: absolute; top: 0; left: 12px; line-height: 1; pointer-events: none;
        }
        .temoignage-offre { font-size: 9px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--cuivre); margin-bottom: 10px; }
        .temoignage p { font-size: 14px; font-style: italic; font-weight: 300; color: var(--sauge-dk); line-height: 1.75; margin-bottom: 18px; }
        .temoignage-author { display: flex; align-items: center; gap: 10px; }
        .temoignage-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: var(--sauge-md); display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 500; color: var(--craie); flex-shrink: 0;
        }
        .temoignage-info .name { font-size: 13px; font-weight: 500; color: var(--sauge-dk); }
        .temoignage-info .detail { font-size: 11.5px; font-weight: 300; color: var(--gris); margin-top: 2px; }
        .stars { color: var(--ocre); font-size: 11px; letter-spacing: 2px; margin-bottom: 10px; }

        .section-cta {
          background: var(--sauge-md); padding: 80px 24px 72px;
          text-align: center; position: relative; overflow: hidden;
        }
        .section-cta::before {
          content: "";
          position: absolute; top: -40px; left: -40px; right: -40px; bottom: -40px;
          background-image: url("/bath.jpg");
          background-size: cover; background-position: center; opacity: 0.06;
        }
        .section-cta-inner { position: relative; z-index: 1; }
        .section-cta h2 {
          font-family: "Playfair Display", serif;
          font-size: clamp(28px, 7.5vw, 38px); font-weight: 400; line-height: 1.25;
          color: var(--craie); margin-bottom: 32px;
        }
        .section-cta h2 em { font-style: italic; color: var(--ocre); }
        .cta-buttons { display: flex; flex-direction: column; gap: 11px; }
        .btn-craie {
          display: flex; align-items: center; justify-content: center;
          background: var(--craie); color: var(--sauge-dk);
          padding: 15px 24px; border-radius: 3px;
          font-family: "DM Sans", sans-serif; font-size: 14.5px; font-weight: 500;
          text-decoration: none; transition: background 0.2s, transform 0.15s;
        }
        .btn-craie:hover { background: white; transform: translateY(-1px); }
        .btn-outline-craie {
          display: flex; align-items: center; justify-content: center;
          background: transparent; color: rgba(245,239,228,0.85);
          padding: 14px 24px; border-radius: 3px;
          font-family: "DM Sans", sans-serif; font-size: 14px; font-weight: 400;
          text-decoration: none; border: 1px solid rgba(245,239,228,0.3);
          transition: all 0.2s;
        }
        .btn-outline-craie:hover { border-color: rgba(245,239,228,0.6); background: rgba(245,239,228,0.06); }

        .section-process { padding: 72px 24px 64px; background: var(--sauge-dk); }
        .section-process h2 {
          font-family: "Playfair Display", serif;
          font-size: clamp(26px, 7vw, 34px); font-weight: 400; color: var(--craie); margin-bottom: 8px;
        }
        .process-sub { font-size: 14px; font-weight: 300; color: var(--sauge-text); opacity: 0.8; margin-bottom: 36px; line-height: 1.6; }
        .steps { display: flex; flex-direction: column; }
        .step { display: flex; gap: 16px; padding: 22px 0; border-bottom: 1px solid rgba(168,204,184,0.12); }
        .step:last-child { border: none; }
        .step-num {
          font-family: "Playfair Display", serif; font-size: 30px; font-weight: 400; font-style: italic;
          color: var(--ocre); opacity: 0.45; flex-shrink: 0; width: 32px; padding-top: 2px;
        }
        .step-content h3 { font-size: 15px; font-weight: 500; color: var(--craie); margin-bottom: 5px; }
        .step-content p { font-size: 13.5px; font-weight: 300; color: var(--sauge-text); line-height: 1.65; opacity: 0.85; }

        footer { background: var(--sauge-dk); padding: 48px 24px 36px; color: var(--sauge-text); }
        .footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .footer-tagline { font-size: 13px; font-weight: 300; color: var(--sauge-text); line-height: 1.65; margin-bottom: 28px; opacity: 0.75; }
        .footer-links { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
        .footer-links a { font-size: 13px; font-weight: 400; color: var(--sauge-text); text-decoration: none; opacity: 0.7; transition: opacity 0.2s; }
        .footer-links a:hover { opacity: 1; }
        .footer-divider { height: 1px; background: rgba(168,204,184,0.12); margin: 20px 0; }
        .footer-social { display: inline-flex; align-items: center; gap: 7px; font-size: 13px; opacity: 0.7; color: var(--sauge-text); text-decoration: none; transition: opacity 0.2s; margin-bottom: 6px; }
        .footer-social:hover { opacity: 1; }
        .footer-bottom { display: flex; flex-direction: column; gap: 6px; font-size: 11.5px; font-weight: 300; color: var(--sauge-text); opacity: 0.4; }
        .footer-bottom a { color: inherit; text-decoration: none; }
        .footer-bottom a:hover { text-decoration: underline; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">
          <svg width="28" height="28" viewBox="-14 -14 28 28" xmlns="http://www.w3.org/2000/svg">
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
        <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <a href="#offres" onClick={() => setMenuOpen(false)}>Les offres</a>
        <a href="#process" onClick={() => setMenuOpen(false)}>Comment ça marche</a>
        <a href="#temoignages" onClick={() => setMenuOpen(false)}>Témoignages</a>
        <a href="mailto:hello@studiokova.fr" onClick={() => setMenuOpen(false)}>Contact</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>La déco personnalisée,<br /><em>enfin accessible.</em></h1>
          <p className="hero-sub">Vous allez adorer rentrer chez vous.</p>
          <div className="hero-ctas">
            <a href="#offres" className="btn-primary">Je trouve mon style →</a>
            <a href="#offres" className="btn-ghost">Voir les offres</a>
          </div>
        </div>
      </section>

      {/* OFFRES */}
      <section className="section-offres" id="offres">
        <div className="section-header reveal" ref={addReveal}>
          <div className="section-eyebrow">Les offres</div>
          <h2>Par où voulez-vous<br />commencer&nbsp;?</h2>
        </div>
        <div className="cards-wrapper">

          <div className="card reveal" ref={addReveal} style={{transitionDelay: "0.1s"}}>
            <div className="card-img" style={{backgroundImage: "url('/window.jpg')"}}>
              <div className="card-img-overlay"></div>
              <span className="card-badge badge-free">Gratuit</span>
              <div className="card-price">0€</div>
            </div>
            <div className="card-body">
              <div className="card-title">Je trouve mon style</div>
              <p className="card-desc">Un quiz de style et je reçois ma palette de couleurs et mon moodboard par email.</p>
              <ul className="card-features">
                <li>Palette de couleurs personnalisée</li>
                <li>Moodboard sur mesure</li>
                <li>Livraison par email</li>
              </ul>
              <a href="/quiz" className="btn-dark">C'est parti →</a>
            </div>
          </div>

          <div className="card featured reveal" ref={addReveal} style={{transitionDelay: "0.2s"}}>
            <div className="card-img" style={{backgroundImage: "url('/shelves.jpg')"}}>
              <div className="card-img-overlay"></div>
              <span className="card-badge badge-ia">Populaire</span>
              <div className="card-price">69€</div>
            </div>
            <div className="card-body">
              <div className="card-title">Je transforme ma pièce</div>
              <p className="card-desc">J'uploade la photo de ma pièce et je reçois un PDF avec des recommandations concrètes en 48h.</p>
              <ul className="card-features">
                <li>Analyse photo de la pièce</li>
                <li>Recommandations couleurs et matières</li>
                <li>PDF complet livré en 48h</li>
              </ul>
              <a href="/analyse" className="btn-primary">C'est parti →</a>
            </div>
          </div>

          <div className="card reveal" ref={addReveal} style={{transitionDelay: "0.3s"}}>
            <div className="card-img" style={{backgroundImage: "url('/lamp.jpg')"}}>
              <div className="card-img-overlay"></div>
              <span className="card-badge badge-premium">Sur mesure</span>
              <div className="card-price"><small>à partir de </small>299€<small>/pièce</small></div>
            </div>
            <div className="card-body">
              <div className="card-title">Je vous confie mon intérieur</div>
              <p className="card-desc">Je confie ma pièce et je reçois une sélection de meubles avec des liens d'achat et une planche produits.</p>
              <ul className="card-features">
                <li>Sélection meubles et objets</li>
                <li>Liens d'achat IKEA et Maisons du Monde</li>
                <li>Planche produits complète</li>
              </ul>
              <a href="/surmesure" className="btn-dark">C'est parti →</a>
            </div>
          </div>

        </div>
      </section>

      {/* PROCESS */}
      <section className="section-process" id="process">
        <div className="reveal" ref={addReveal}>
          <div style={{display:"inline-flex",alignItems:"center",gap:"8px",fontSize:"10px",fontWeight:"500",letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--ocre)",marginBottom:"10px"}}>
            <span style={{display:"block",width:"24px",height:"1px",background:"var(--ocre)"}}></span>
            Comment ça marche
          </div>
          <h2>De chez vous,<br />en quelques clics.</h2>
          <p className="process-sub">Pas de rendez-vous. Pas d'attente. Votre intérieur se transforme depuis chez vous.</p>
        </div>
        <div className="steps">
          <div className="step reveal" ref={addReveal} style={{transitionDelay:"0.1s"}}>
            <div className="step-num">1</div>
            <div className="step-content">
              <h3>Je choisis mon offre</h3>
              <p>Je commence gratuitement avec le quiz de style ou je vais directement vers l'analyse de ma pièce.</p>
            </div>
          </div>
          <div className="step reveal" ref={addReveal} style={{transitionDelay:"0.2s"}}>
            <div className="step-num">2</div>
            <div className="step-content">
              <h3>Je partage mon espace</h3>
              <p>Je réponds à quelques questions ou j'uploade une photo de ma pièce. Ça prend cinq minutes.</p>
            </div>
          </div>
          <div className="step reveal" ref={addReveal} style={{transitionDelay:"0.3s"}}>
            <div className="step-num">3</div>
            <div className="step-content">
              <h3>Je reçois mon plan</h3>
              <p>Mon PDF personnalisé arrive en 48h avec des conseils concrets et des liens d'achat prêts à utiliser.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEPARATEUR PHOTO */}
      <div className="photo-sep"></div>

      {/* TEMOIGNAGES */}
      <section className="section-temoignages" id="temoignages">
        <h2 className="reveal" ref={addReveal}>Ils ont aimé rentrer chez eux</h2>
        <div className="temoignages-grid">
          <div className="temoignage reveal" ref={addReveal} style={{transitionDelay:"0.1s"}}>
            <div className="stars">★★★★★</div>
            <div className="temoignage-offre">Je transforme ma pièce · 69€</div>
            <p>"Je savais que j'aimais le bleu mais je ne savais pas comment l'associer. J'ai reçu une palette bleu nuit, blanc cassé et rotin naturel. C'est exactement l'ambiance que j'avais en tête sans savoir le dire."</p>
            <div className="temoignage-author">
              <div className="temoignage-avatar">M</div>
              <div className="temoignage-info">
                <div className="name">Marie T.</div>
                <div className="detail">Paris</div>
              </div>
            </div>
          </div>
          <div className="temoignage reveal" ref={addReveal} style={{transitionDelay:"0.2s"}}>
            <div className="stars">★★★★★</div>
            <div className="temoignage-offre">Je vous confie mon intérieur · 299€</div>
            <p>"J'aurais jamais choisi ces meubles seule. Et pourtant c'est exactement mon style. Mon salon ressemble enfin à ce que j'avais en tête."</p>
            <div className="temoignage-author">
              <div className="temoignage-avatar" style={{background:"var(--cuivre)"}}>C</div>
              <div className="temoignage-info">
                <div className="name">Camille R.</div>
                <div className="detail">Lyon</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section-cta">
        <div className="section-cta-inner">
          <h2>Votre style existe déjà.<br /><em>Je vous aide à le trouver.</em></h2>
          <div className="cta-buttons">
            <a href="#offres" className="btn-craie">Je trouve mon style →</a>
            <a href="#offres" className="btn-outline-craie">Voir toutes les offres</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <svg width="34" height="34" viewBox="-14 -14 28 28" xmlns="http://www.w3.org/2000/svg">
            <rect transform="translate(0,-8) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#B8612A"/>
            <rect transform="translate(8,0) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#F5EFE4"/>
            <rect transform="translate(-8,0) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#E8C97A"/>
            <rect transform="translate(0,8) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#6B9E7A"/>
          </svg>
          <div className="nav-logotype">
            <span className="studio" style={{color:"var(--sauge-text)"}}>Studio</span>
            <span className="kova" style={{color:"var(--craie)"}}>Kova</span>
          </div>
        </div>
        <p className="footer-tagline">Conseil en décoration d'appartement<br />personnalisé et accessible.</p>
        <div className="footer-links">
          <a href="#offres">Les offres</a>
          <a href="#process">Comment ça marche</a>
          <a href="#temoignages">Témoignages</a>
          <a href="mailto:hello@studiokova.fr">hello@studiokova.fr</a>
        </div>
        <a href="https://instagram.com/studiokova.fr" className="footer-social">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          @studiokova.fr
        </a>
        <div className="footer-divider"></div>
        <div className="footer-bottom">
          <span>© 2025 Studio Kova</span>
          <span><a href="/mentions-legales">Mentions légales</a> · <a href="/confidentialite">Politique de confidentialité</a></span>
        </div>
      </footer>
    </>
  );
}