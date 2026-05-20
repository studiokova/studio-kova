"use client";
import { useEffect, useRef } from "react";
import KovaNav from "@/components/kova/KovaNav";
import KovaHeading from "@/components/kova/KovaHeading";
import KovaButton from "@/components/kova/KovaButton";
import KovaFooter from "@/components/kova/KovaFooter";
import { track } from "@/lib/plausible";
import { PIECES, OFFRES, HOW_STEPS, FAQ_ITEMS, REASSURANCE_ITEMS } from "./homeData";

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

      {/* ── 1. HERO ── */}
      <section className="kova-hero-pf">
        <div className="kova-hero-pf__inner">
          <h1 className="kova-hero-pf__title">
            Transformez votre pièce en 48h.<br />
            <em>Sans décorateur à 2000€,<br />sans Pinterest infini.</em>
          </h1>
          <p className="kova-hero-pf__sub">
            Analyse IA personnalisée + plan d&apos;action concret. Livré en 48h. À partir de 49€.
          </p>
          <a href="#pieces" className="kova-hero-pf__anchor" onClick={() => track("Clic ancre piece")}>
            Quelle pièce voulez-vous transformer&nbsp;? ↓
          </a>
        </div>
      </section>

      {/* ── 2. SÉLECTEUR DE PIÈCE ── */}
      <section className="kova-pieces" id="pieces">
        <div className="kova-pieces__header reveal" ref={ref}>
          <KovaHeading level="h2">Quelle pièce voulez-vous transformer&nbsp;?</KovaHeading>
        </div>
        <div className="kova-pieces__grid">
          {PIECES.map((p, i) => (
            <a
              key={p.slug}
              href={`/piece/${p.slug}`}
              className="kova-piece-card reveal"
              ref={ref}
              style={{ transitionDelay: `${i * 0.07}s` }}
              onClick={() => track("Clic pièce home", { piece: p.slug })}
            >
              <div className="kova-piece-card__bg" style={{ background: p.bg }} />
              <div className="kova-piece-card__overlay" />
              <span className="kova-piece-card__name">{p.label}</span>
            </a>
          ))}
        </div>
        <p className="kova-pieces__quiz-link">
          Pas sûre de votre style&nbsp;?{" "}
          <a href="/quiz" onClick={() => track("Clic offre gratuite")}>Faites le quiz de 3 minutes (gratuit) →</a>
        </p>
      </section>

      {/* ── 3. ANCRAGE PRIX ── */}
      <section className="kova-price-anchor">
        <div className="kova-price-anchor__header reveal" ref={ref}>
          <KovaHeading level="h2">Combien coûte un intérieur qui vous ressemble&nbsp;?</KovaHeading>
        </div>
        <div className="kova-price-anchor__grid">
          {[
            { opt: "Décorateur d'intérieur", price: "500 à 2 000€/pièce", featured: false },
            { opt: "Pinterest",              price: "Gratuit mais infini",  featured: false },
            { opt: "Studio Kova",            price: "49€ — livré en 48h",  featured: true  },
          ].map((r, i) => (
            <div key={i} className={`kova-price-row${r.featured ? " kova-price-row--featured" : ""} reveal`} ref={ref} style={{ transitionDelay: `${i * 0.1}s` }}>
              <span className="kova-price-row__option">{r.opt}</span>
              <span className="kova-price-row__price">{r.price}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. LES 3 OFFRES ── */}
      <section className="kova-offres" id="offres">
        <div className="kova-offres__header reveal" ref={ref}>
          <KovaHeading level="h2">Choisissez votre niveau d&apos;accompagnement</KovaHeading>
        </div>
        <div className="kova-offres__grid">
          {OFFRES.map((o, i) => (
            <div key={i} className={`kova-card${o.featured ? " kova-card--featured" : ""} reveal`} ref={ref} style={{ transitionDelay: `${(i + 1) * 0.1}s` }}>
              <div className="kova-card__img" style={{ background: o.bg }}>
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

      {/* ── 5. COMMENT FONCTIONNE L'ANALYSE IA ── */}
      <section className="kova-how">
        <div className="kova-how__header reveal" ref={ref}>
          <KovaHeading level="h2" light>Comment fonctionne l&apos;analyse IA&nbsp;?</KovaHeading>
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
        <div className="kova-how__reassurance reveal" ref={ref}>
          <p className="kova-how__reassurance-text">« L&apos;IA fait l&apos;analyse. Je supervise et je vous livre. »</p>
          <p className="kova-how__reassurance-sig">— Studio Kova</p>
        </div>
      </section>

      {/* ── 6. RÉASSURANCE ── */}
      <section className="kova-reassurance">
        <div className="kova-reassurance__header reveal" ref={ref}>
          <KovaHeading level="h2">Pourquoi Studio Kova&nbsp;?</KovaHeading>
        </div>
        <ul className="kova-reassurance__list">
          {REASSURANCE_ITEMS.map((item, i) => (
            <li key={i} className="kova-reassurance__item reveal" ref={ref} style={{ transitionDelay: `${i * 0.1}s` }}>
              <span className="kova-reassurance__check">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 7. FAQ ── */}
      <section className="kova-faq">
        <div className="kova-faq__header reveal" ref={ref}>
          <KovaHeading level="h2">Vos questions, nos réponses</KovaHeading>
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
      <section className="kova-cta-final">
        <div className="kova-cta-final__inner">
          <KovaHeading level="h2" light>Par quelle pièce on commence&nbsp;?</KovaHeading>
          <div className="kova-cta-final__buttons">
            <KovaButton variant="light" href="#pieces" fullWidth>Choisir ma pièce →</KovaButton>
            <a href="/quiz" className="kova-cta-final__secondary" onClick={() => track("Clic offre gratuite")}>
              Faire le quiz d&apos;abord →
            </a>
          </div>
        </div>
      </section>

      <KovaFooter full />
    </>
  );
}
