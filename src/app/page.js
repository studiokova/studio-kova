"use client";
import { useEffect, useRef } from "react";
import KovaNav from "@/components/kova/KovaNav";
import KovaHeading from "@/components/kova/KovaHeading";
import KovaButton from "@/components/kova/KovaButton";
import KovaFooter from "@/components/kova/KovaFooter";
import { track } from "@/lib/plausible";
import { PIECES, OFFRES, HOW_STEPS, FAQ_ITEMS } from "./homeData";

export default function Home() {
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
        });
      },
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ref = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  return (
    <>
      <KovaNav full />

      {/* ── 1. HERO IMMERSIF ── */}
      <section className="kova-hero-imm">
        <div className="kova-hero-imm__bg" style={{ backgroundImage: "url('/images/site/hero.webp')" }} />
        <div className="kova-hero-imm__overlay" />
        <div className="kova-hero-imm__inner">
          <h1 className="kova-hero-imm__title">La déco personnalisée,<br /><em>enfin accessible.</em></h1>
          <p className="kova-hero-imm__sub">Vous allez adorer rentrer chez vous.</p>
          <div className="kova-hero-imm__ctas">
            <KovaButton variant="primary" href="/je-transforme-ma-piece">J&apos;analyse ma pièce avec l&apos;IA →</KovaButton>
            <KovaButton variant="ghost" href="#offres">Voir les offres</KovaButton>
          </div>
        </div>
      </section>

      {/* ── 2. SECTION PIÈCES ── */}
      <section className="kova-pieces" id="pieces">
        <div className="kova-pieces__header">
          <p className="kova-kicker">Votre espace</p>
          <h2 className="kova-pieces__title">Choisissez la pièce à transformer</h2>
        </div>
        <div className="kova-pieces__grid">
          {PIECES.map((p, i) => (
            <a
              key={p.slug}
              href={`/piece/${p.slug}`}
              className="kova-piece-card reveal"
              ref={ref}
              style={{ transitionDelay: `${i * 0.07}s` }}
              aria-label={p.aria}
              onClick={() => track("Clic pièce home", { piece: p.slug })}
            >
              <div className="kova-piece-card__img" style={{ backgroundImage: `url(${p.img})` }} />
              <div className="kova-piece-card__label">
                <h3 className="kova-piece-card__name">{p.label}</h3>
                <span className="kova-piece-card__arrow">→</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── 3. BANDEAU ÉMOTIONNEL ── */}
      <section className="kova-bandeau">
        <h2 className="kova-bandeau__title">Vous allez adorer rentrer chez vous.</h2>
      </section>

      {/* ── 4. LES 3 OFFRES ── */}
      <section className="kova-offres" id="offres">
        <div className="kova-offres__header reveal" ref={ref}>
          <p className="kova-kicker">Par où commencer</p>
          <KovaHeading level="h2" className="kova-heading--nav">Trois façons de travailler ensemble</KovaHeading>
        </div>
        <div className="kova-offres__grid">
          {OFFRES.map((o, i) => (
            <div key={i} className={`kova-card${o.featured ? " kova-card--featured" : ""} reveal`} ref={ref} style={{ transitionDelay: `${(i + 1) * 0.1}s` }}>
              <div className="kova-card__img" style={{ backgroundImage: `url(${o.img})` }}>
                <div className="kova-card__img-overlay" />
                <div className="kova-card__badge"><span className={`kova-badge ${o.badgeClass}`}>{o.badgeText}</span></div>
                <div className="kova-card__price">
                  {o.priceFrom && <span className="kova-card__price-label">{o.priceFrom}</span>}
                  {o.price}{o.priceUnit || ""}
                </div>
              </div>
              <div className="kova-card__body">
                <div className="kova-card__title">{o.title}</div>
                <div className="kova-card__desc">{o.desc}</div>
                <KovaButton variant={o.ctaVariant} href={o.ctaHref} fullWidth onClick={() => track(o.event)}>
                  {o.ctaLabel}
                </KovaButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SÉPARATEUR PHOTO ── */}
      <div className="kova-photo-sep" style={{ backgroundImage: "url('/images/site/section.webp')" }} />

      {/* ── 5. COMMENT FONCTIONNE L'ANALYSE IA ── */}
      <section className="kova-how">
        <div className="kova-how__header reveal" ref={ref}>
          <p className="kova-kicker kova-kicker--light">Dans les coulisses</p>
          <KovaHeading level="h2" light className="kova-heading--nav">Comment fonctionne l&apos;analyse IA&nbsp;?</KovaHeading>
        </div>
        <div className="kova-how__steps">
          {HOW_STEPS.map((s, i) => (
            <div key={i} className="kova-how__step reveal" ref={ref} style={{ transitionDelay: `${(i + 1) * 0.1}s` }}>
              <div className="kova-how__num">{s.n}</div>
              <div>
                <div className="kova-how__step-title">{s.title}</div>
                <div className="kova-how__step-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <section className="kova-faq">
        <div className="kova-faq__header reveal" ref={ref}>
          <p className="kova-kicker">Vos questions</p>
          <KovaHeading level="h2" className="kova-heading--nav">Les questions que vous me posez</KovaHeading>
        </div>
        <div className="kova-faq__list">
          {FAQ_ITEMS.map((item, i) => (
            <details key={i} className="reveal" ref={ref} style={{ transitionDelay: `${i * 0.07}s` }}>
              <summary>{item.q}</summary>
              <p className="kova-faq__answer">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── 8. CTA FINAL ── */}
      <section className="kova-cta-final" style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: "-40px", backgroundImage: "url('/images/pieces/bath.webp')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08 }} />
        <div className="kova-cta-final__inner" style={{ position: "relative", zIndex: 1 }}>
          <KovaHeading level="h2" light>Prête à transformer votre pièce&nbsp;?</KovaHeading>
          <div className="kova-cta-final__buttons">
            <KovaButton variant="primary" href="#pieces" fullWidth>Choisir ma pièce →</KovaButton>
            <KovaButton variant="ghost" href="/quiz" fullWidth onClick={() => track("Clic offre gratuite")}>
              Faire le quiz d&apos;abord →
            </KovaButton>
          </div>
        </div>
      </section>

      <KovaFooter />
    </>
  );
}
