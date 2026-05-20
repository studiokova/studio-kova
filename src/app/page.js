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
        <div className="kova-hero-pf__bg" style={{ backgroundImage: "url('/hero.webp')" }} />
        <div className="kova-hero-pf__bg-overlay" />
        <div className="kova-hero-pf__inner">
          <h1 className="kova-hero-pf__title">Par où on commence&nbsp;?</h1>
          <p className="kova-hero-pf__sub">
            Une analyse personnalisée et un plan d&apos;action concret pour transformer votre pièce, livré en 48h.
          </p>
          <div className="kova-hero-pf__ctas">
            <KovaButton variant="light" href="/analyse" onClick={() => track("Clic offre 49")}>
              Analyser ma pièce →
            </KovaButton>
            <KovaButton variant="ghost" href="#offres">Voir les offres</KovaButton>
          </div>
        </div>
      </section>

      {/* ── 2. SÉLECTEUR DE PIÈCE ── */}
      <section className="kova-pieces" id="pieces">
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
              <div className="kova-piece-card__bg" style={{ backgroundImage: `url(${p.img})` }} />
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

      {/* ── 3. LES 3 OFFRES ── */}
      <section className="kova-offres" id="offres">
        <div className="kova-offres__header reveal" ref={ref}>
          <KovaHeading level="h2">Choisissez votre niveau d&apos;accompagnement</KovaHeading>
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
      <div className="kova-photo-sep" style={{ backgroundImage: "url('/section.webp')" }} />

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
      <section className="kova-cta-final" style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: "-40px", backgroundImage: "url('/bath.webp')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08 }} />
        <div className="kova-cta-final__inner" style={{ position: "relative", zIndex: 1 }}>
          <KovaHeading level="h2" light>Par quelle pièce on commence&nbsp;?</KovaHeading>
          <div className="kova-cta-final__buttons">
            <KovaButton variant="light" href="#pieces" fullWidth>Choisir ma pièce →</KovaButton>
            <KovaButton variant="outline-light" href="/quiz" fullWidth onClick={() => track("Clic offre gratuite")}>
              Faire le quiz d&apos;abord →
            </KovaButton>
          </div>
        </div>
      </section>

      <KovaFooter full />
    </>
  );
}
