'use client';
import { useEffect, useRef } from 'react';
import KovaNav from '@/components/kova/KovaNav';
import KovaHeading from '@/components/kova/KovaHeading';
import KovaButton from '@/components/kova/KovaButton';
import KovaFooter from '@/components/kova/KovaFooter';
import KovaArticleCard from '@/components/kova/KovaArticleCard';
import KovaCloser from '@/components/KovaCloser';
import OffreDetail from '@/components/offre/OffreDetail';
import OffreApercu from '@/components/offre/OffreApercu';
import { track } from '@/lib/plausible';
import { PROMO } from '@/lib/config';
import PropTypes from 'prop-types';

export default function PieceTemplate({ data, relatedPosts = [] }) {
  const revealRefs = useRef([]);

  useEffect(() => {
    track('Vue page piece', { piece: data.slug });
    const engageTimer = setTimeout(() => track('Piece Engaged', { piece: data.slug }), 30_000);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => { clearTimeout(engageTimer); observer.disconnect(); };
  }, [data.slug]);

  const ref = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  function trackCta(position) {
    track('Clic CTA piece', { piece: data.slug, cta: position });
  }

  function promoLabel(label) {
    return PROMO.active ? label.replace(PROMO.originalDisplay, PROMO.display) : label;
  }

  const enjeuxParagraphs = data.enjeux.body.split('\n\n');
  const cappedPosts = relatedPosts.slice(0, 2);
  const hasArticles = cappedPosts.length > 0;
  const isSingleArticle = cappedPosts.length === 1;

  return (
    <>
      <KovaNav full />

      {/* ── Bloc 1 : Hero ── */}
      <section className="kova-pt-hero">
        <div className="kova-pt-hero__bg" style={{ backgroundImage: `url(${data.hero.image})` }} />
        <div className="kova-pt-hero__overlay" />
        <div className="kova-pt-hero__inner">
          <h1 className="kova-pt-hero__h1">{data.hero.h1}</h1>
          <p className="kova-pt-hero__sub">
            Envoyez vos photos. Recevez sous 48h un diagnostic complet et trois directions
            chiffrées pour transformer votre {data.slug}.
          </p>
          <div className="kova-pt-hero__ctas">
            <KovaButton
              variant="primary"
              href={data.hero.ctaPrimary.href}
              onClick={() => trackCta('hero-primary')}
            >
              {promoLabel(data.hero.ctaPrimary.label)}
            </KovaButton>
            {PROMO.active && (
              <p style={{ fontSize: '0.82rem', textAlign: 'center', color: 'var(--craie)', margin: '2px 0 0', fontWeight: 500 }}>
                <s style={{ opacity: 0.55, fontWeight: 400 }}>{PROMO.originalDisplay}</s>
                {' '}{PROMO.display}
                {' '}<span style={{ opacity: 0.7, fontWeight: 400, fontStyle: 'italic' }}>· jusqu&apos;au {PROMO.endLabel}</span>
              </p>
            )}
            <a
              href="/quiz"
              className="kova-pt-hero__text-link"
              onClick={() => trackCta('hero-secondary')}
            >
              {data.hero.ctaSecondary.label}
            </a>
            <p style={{ fontSize: '0.72rem', opacity: 0.55, textAlign: 'center', color: 'var(--craie)', margin: 0, fontStyle: 'italic' }}>
              Analyse livrée sous 48h.<br />Si elle ne vous parle pas, je vous rembourse.
            </p>
          </div>
        </div>
      </section>

      {/* ── Bloc 2 : Comment ça marche — clair ── */}
      <section className="kova-pt-section kova-pt-section--craie">
        <div className="kova-pt-section__inner">
          <div className="reveal" ref={ref}>
            <OffreDetail piece={data.slug} only="steps" />
          </div>
        </div>
      </section>

      {/* ── Bloc 3 : Ce que vous recevez — foncé ── */}
      <section className="kova-pt-section kova-pt-section--dark">
        <div className="kova-pt-section__inner">
          <div className="reveal" ref={ref}>
            <OffreDetail piece={data.slug} only="deliverables" dark />
          </div>
        </div>
      </section>

      {/* ── Bloc 4 : Aperçu du livrable — clair ── */}
      <section className="kova-pt-section kova-pt-section--craie">
        <div className="kova-pt-section__inner">
          <div className="reveal" ref={ref}>
            <OffreApercu />
          </div>
        </div>
      </section>

      {/* ── Bloc 5 : Ce qu'on examine — foncé ── */}
      <section className="kova-pt-section kova-pt-section--dark">
        <div className="kova-pt-section__inner">
          <div className="reveal" ref={ref}>
            <p className="kova-kicker kova-kicker--light">Ce qu&apos;on examine</p>
            <KovaHeading level="h2" light className="kova-heading--nav">{data.analyse.title}</KovaHeading>
          </div>
          <ul className="kova-pt-points">
            {data.analyse.points.map((point, i) => (
              <li key={i} className="kova-pt-point reveal" ref={ref} style={{ transitionDelay: `${i * 0.07}s` }}>
                <span className="kova-pt-point__check">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="kova-pt-analyse-cta reveal" ref={ref}>
            <KovaButton
              variant="primary"
              href={data.hero.ctaPrimary.href}
              onClick={() => trackCta('analyse')}
            >
              {promoLabel(data.hero.ctaPrimary.label)}
            </KovaButton>
            {PROMO.active && (
              <p style={{ fontSize: '0.8rem', textAlign: 'center', color: 'var(--craie)', margin: '6px 0 0', opacity: 0.8 }}>
                <s style={{ opacity: 0.6 }}>{PROMO.originalDisplay}</s> {PROMO.display} · jusqu&apos;au {PROMO.endLabel}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Bloc 6 : Les enjeux de la pièce — clair ── */}
      <section className="kova-pt-section kova-pt-section--craie">
        <div className="kova-pt-section__inner">
          <div className="reveal" ref={ref}>
            <p className="kova-kicker">La pièce</p>
            <KovaHeading level="h2" className="kova-heading--nav">{data.enjeux.title}</KovaHeading>
            <div className="kova-pt-body">
              {enjeuxParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bloc 7 : FAQ — foncé ── */}
      <section className="kova-faq kova-faq--dark">
        <div className="kova-faq__header reveal" ref={ref}>
          <p className="kova-kicker kova-kicker--light">Vos questions</p>
          <KovaHeading level="h2" light className="kova-heading--nav">{data.faqTitle}</KovaHeading>
        </div>
        <div className="kova-faq__list">
          {data.faq.map((item, i) => (
            <details key={i} className="reveal" ref={ref} style={{ transitionDelay: `${i * 0.07}s` }}>
              <summary>{item.q}</summary>
              <p className="kova-faq__answer" dangerouslySetInnerHTML={{ __html: item.a }} />
            </details>
          ))}
        </div>
      </section>

      {/* ── Bloc 8 : CTA final — clair ── */}
      <section className="kova-cta-final kova-cta-final--light">
        <div className="kova-cta-final__inner reveal" ref={ref}>
          <KovaHeading level="h2">{data.ctaFinal.title}</KovaHeading>
          <div className="kova-cta-final__buttons">
            <KovaButton
              variant="primary"
              href={data.ctaFinal.ctaPrimary.href}
              onClick={() => trackCta('final-primary')}
            >
              {promoLabel(data.ctaFinal.ctaPrimary.label)}
            </KovaButton>
            <KovaButton
              variant="dark"
              href={data.ctaFinal.ctaSecondary.href}
              onClick={() => trackCta('final-secondary')}
            >
              {data.ctaFinal.ctaSecondary.label}
            </KovaButton>
          </div>
        </div>
      </section>

      {/* ── Bloc 9 : Articles liés (max 2) — foncé ── */}
      {hasArticles && (
        <section className="kova-pt-articles kova-pt-articles--dark">
          <div className="kova-pt-articles__inner">
            <div className="reveal" ref={ref}>
              <p className="kova-kicker kova-kicker--light">Pour aller plus loin</p>
              <KovaHeading level="h2" light className="kova-heading--nav">
                {isSingleArticle ? 'À lire sur ce sujet' : 'Articles sur cette pièce'}
              </KovaHeading>
            </div>
            <div className={isSingleArticle ? 'kova-pt-articles__pillar' : 'kova-pt-articles__grid'}>
              {cappedPosts.map((post) => (
                <div key={post.slug} className="reveal" ref={ref}>
                  <KovaArticleCard
                    href={`/blog/${post.slug}`}
                    title={post.title}
                    excerpt={post.excerpt}
                    date={post.date}
                    image={post.image}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bloc 10 : Phrase de clôture — clair ── */}
      <KovaCloser />

      <KovaFooter />
    </>
  );
}

PieceTemplate.propTypes = {
  data: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    hero: PropTypes.shape({
      h1: PropTypes.string.isRequired,
      subtitle: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      ctaPrimary: PropTypes.shape({ label: PropTypes.string.isRequired, href: PropTypes.string.isRequired }).isRequired,
      ctaSecondary: PropTypes.shape({ label: PropTypes.string.isRequired, href: PropTypes.string.isRequired }).isRequired,
    }).isRequired,
    enjeux: PropTypes.shape({
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
    }).isRequired,
    analyse: PropTypes.shape({
      title: PropTypes.string.isRequired,
      points: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    faqTitle: PropTypes.string.isRequired,
    faq: PropTypes.arrayOf(
      PropTypes.shape({ q: PropTypes.string.isRequired, a: PropTypes.string.isRequired })
    ).isRequired,
    ctaFinal: PropTypes.shape({
      title: PropTypes.string.isRequired,
      ctaPrimary: PropTypes.shape({ label: PropTypes.string.isRequired, href: PropTypes.string.isRequired }).isRequired,
      ctaSecondary: PropTypes.shape({ label: PropTypes.string.isRequired, href: PropTypes.string.isRequired }).isRequired,
    }).isRequired,
  }).isRequired,
  relatedPosts: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      date: PropTypes.string.isRequired,
      image: PropTypes.string,
    })
  ),
};
