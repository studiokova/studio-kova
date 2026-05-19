"use client";
import { useEffect, useRef } from "react";
import KovaNav      from "@/components/kova/KovaNav";
import KovaHero     from "@/components/kova/KovaHero";
import KovaBadge    from "@/components/kova/KovaBadge";
import KovaHeading  from "@/components/kova/KovaHeading";
import KovaCard     from "@/components/kova/KovaCard";
import KovaButton   from "@/components/kova/KovaButton";
import KovaFooter   from "@/components/kova/KovaFooter";
import { OFFERS }   from "@/lib/config";
import { track }    from "@/lib/plausible";

export default function Home() {
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

  const ref = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <>
      {/* ── NAV ── */}
      <KovaNav showBack={false} />

      {/* ── HERO ── */}
      <KovaHero
        image="/hero.webp"
        title={<>La déco personnalisée,<br /><em>enfin accessible.</em></>}
        subtitle="Vous allez adorer rentrer chez vous."
        cta={{ label: "Je trouve mon style →", href: "/quiz", onClick: () => track("Hero CTA Clicked", { offer: "free" }) }}
        ctaSecondary={{ label: "Voir les offres", href: "#offres" }}
      />

      {/* ── OFFRES ── */}
      <section className="kova-section" id="offres">
        <div className="kova-section__header reveal" ref={ref}>
          <div className="kova-section__eyebrow">
            <KovaBadge variant="eyebrow">Les offres</KovaBadge>
          </div>
          <KovaHeading level="h2">
            Par où voulez-vous<br />commencer&nbsp;?
          </KovaHeading>
        </div>

        <div className="kova-cards">
          <div className="reveal" ref={ref} style={{ transitionDelay: "0.1s" }}>
            <KovaCard
              image="/window.webp"
              badge={OFFERS.quiz.display}
              badgeVariant="gold"
              price={OFFERS.quiz.display}
              title="Je trouve mon style"
              description="Un quiz de style et je reçois mon profil déco personnalisé par email."
              features={[
                "Votre profil déco personnalisé",
                "Palette de couleurs sur mesure",
                "3 premières actions concrètes",
              ]}
              ctaLabel="C'est parti →"
              ctaHref="/quiz"
              ctaVariant="dark"
              onCtaClick={() => track("Offers Section CTA Clicked", { offer: "free" })}
            />
          </div>

          <div className="reveal" ref={ref} style={{ transitionDelay: "0.2s" }}>
            <KovaCard
              image="/shelves.webp"
              badge="Populaire"
              badgeVariant="copper"
              price={OFFERS.analyse.display}
              title="Je transforme ma pièce"
              description="J'uploade la photo de ma pièce et je reçois un PDF avec des recommandations concrètes en 48h."
              features={[
                "Analyse photo de la pièce",
                "Recommandations couleurs et aménagement",
                "PDF complet livré en 48h",
              ]}
              ctaLabel="C'est parti →"
              ctaHref="/je-transforme-ma-piece"
              ctaVariant="primary"
              featured
              onCtaClick={() => track("Offers Section CTA Clicked", { offer: "analysis" })}
            />
          </div>

          <div className="reveal" ref={ref} style={{ transitionDelay: "0.3s" }}>
            <KovaCard
              image="/lamp.webp"
              badge="Sur mesure"
              badgeVariant="dark"
              priceLabel="à partir de"
              price={`${OFFERS.surmesure.stripePerPiece}€`}
              priceUnit="/pièce"
              title="Je vous confie mon intérieur"
              description="Je confie ma pièce et je reçois une sélection de meubles avec des liens d'achat et une planche produits."
              features={[
                "Sélection meubles et objets",
                "Liens d'achat selon votre budget",
                "Planche produits complète",
              ]}
              ctaLabel="C'est parti →"
              ctaHref="/surmesure"
              ctaVariant="dark"
              onCtaClick={() => track("Offers Section CTA Clicked", { offer: "premium" })}
            />
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="kova-section--process" id="process">
        <div className="reveal" ref={ref}>
          <div style={{ marginBottom: "10px" }}>
            <KovaBadge variant="eyebrow-light">Comment ça marche</KovaBadge>
          </div>
          <KovaHeading level="h2" light>
            De chez vous,<br />en quelques clics.
          </KovaHeading>
          <p className="kova-process-sub">
            Pas de rendez-vous. Pas d&rsquo;attente. Votre intérieur se transforme depuis chez vous.
          </p>
        </div>

        <div className="kova-steps">
          {[
            { n: "1", title: "Je choisis mon offre", desc: "Je commence gratuitement avec le quiz de style ou je vais directement vers l'analyse de ma pièce." },
            { n: "2", title: "Je partage mon espace", desc: "Je réponds à quelques questions ou j'uploade une photo de ma pièce. Ça prend cinq minutes." },
            { n: "3", title: "Je reçois mon plan",   desc: "Mon PDF personnalisé arrive en 48h avec des conseils concrets et des liens d'achat prêts à utiliser." },
          ].map((s, i) => (
            <div key={i} className="kova-step reveal" ref={ref} style={{ transitionDelay: `${(i + 1) * 0.1}s` }}>
              <div className="kova-step__num">{s.n}</div>
              <div>
                <div className="kova-step__title">{s.title}</div>
                <div className="kova-step__desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SÉPARATEUR PHOTO ── */}
      <div className="kova-photo-sep" style={{ backgroundImage: "url('/section.webp')" }} />

      {/* ── TÉMOIGNAGES ── */}
      <section className="kova-temoignages" id="temoignages">
        <div className="reveal" ref={ref}>
          <KovaHeading level="h2">Ils ont aimé rentrer chez eux</KovaHeading>
        </div>

        <div className="kova-temoignages__grid">
          {[
            {
              stars: "★★★★★",
              offre: `Je transforme ma pièce · ${OFFERS.analyse.display}`,
              text: "« Je savais que j'aimais le bleu mais je ne savais pas comment l'associer. J'ai reçu une palette bleu nuit, blanc cassé et rotin naturel. C'est exactement l'ambiance que j'avais en tête sans savoir le dire. »",
              avatar: "M", avatarBg: "var(--sauge-md)",
              name: "Marie T.", detail: "Paris",
              delay: "0.1s",
            },
            {
              stars: "★★★★★",
              offre: `Je vous confie mon intérieur · ${OFFERS.surmesure.stripePerPiece}€`,
              text: "« J'aurais jamais choisi ces meubles seule. Et pourtant c'est exactement mon style. Mon salon ressemble enfin à ce que j'avais en tête. »",
              avatar: "C", avatarBg: "var(--cuivre)",
              name: "Camille R.", detail: "Lyon",
              delay: "0.2s",
            },
          ].map((t, i) => (
            <div key={i} className="kova-temoignage reveal" ref={ref} style={{ transitionDelay: t.delay }}>
              <div className="kova-temoignage__stars">{t.stars}</div>
              <div className="kova-temoignage__offre">{t.offre}</div>
              <p className="kova-temoignage__text">{t.text}</p>
              <div className="kova-temoignage__author">
                <div className="kova-temoignage__avatar" style={{ background: t.avatarBg }}>{t.avatar}</div>
                <div>
                  <div className="kova-temoignage__name">{t.name}</div>
                  <div className="kova-temoignage__detail">{t.detail}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINALE ── */}
      <section className="kova-cta-section">
        <div className="kova-cta-section__bg" style={{ backgroundImage: "url('/bath.webp')" }} />
        <div className="kova-cta-section__inner">
          <h2 className="kova-cta-section__title">
            Votre style existe déjà.<br /><em>Je vous aide à le trouver.</em>
          </h2>
          <div className="kova-cta-section__buttons">
            <KovaButton variant="light" href="/quiz" fullWidth onClick={() => track("Final CTA Clicked", { offer: "free" })}>
              Je trouve mon style →
            </KovaButton>
            <KovaButton variant="outline-light" href="#offres" fullWidth>
              Voir toutes les offres
            </KovaButton>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <KovaFooter full />
    </>
  );
}
