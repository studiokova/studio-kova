'use client';
import { useEffect, useRef } from 'react';
import KovaNav from '@/components/kova/KovaNav';
import KovaHeading from '@/components/kova/KovaHeading';
import KovaButton from '@/components/kova/KovaButton';
import KovaFooter from '@/components/kova/KovaFooter';
import KovaArticleCard from '@/components/kova/KovaArticleCard';
import { track } from '@/lib/plausible';
import PropTypes from 'prop-types';

export default function PieceTemplate({ data, relatedPosts = [] }) {
  const revealRefs = useRef([]);

  useEffect(() => {
    track('Vue page piece', { piece: data.slug });

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
    return () => observer.disconnect();
  }, [data.slug]);

  const ref = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  function trackCta(position) {
    track('Clic CTA piece', { piece: data.slug, cta: position });
  }

  const enjeuxParagraphs = data.enjeux.body.split('\n\n');
  const hasArticles = relatedPosts.length > 0;
  const isSingleArticle = relatedPosts.length === 1;

  return (
    <>
      <KovaNav full />

      {/* ── Bloc 1 : Hero ── */}
      <section className="kova-pt-hero">
        <div className="kova-pt-hero__bg" style={{ backgroundImage: `url(${data.hero.image})` }} />
        <div className="kova-pt-hero__overlay" />
        <div className="kova-pt-hero__inner">
          <h1 className="kova-pt-hero__h1">{data.hero.h1}</h1>
          <p className="kova-pt-hero__sub">{data.hero.subtitle}</p>
          <div className="kova-pt-hero__ctas">
            <KovaButton
              variant="primary"
              href={data.hero.ctaPrimary.href}
              onClick={() => trackCta('hero-primary')}
            >
              {data.hero.ctaPrimary.label}
            </KovaButton>
            <KovaButton
              variant="outline-light"
              href={data.hero.ctaSecondary.href}
              onClick={() => trackCta('hero-secondary')}
            >
              {data.hero.ctaSecondary.label}
            </KovaButton>
          </div>
        </div>
      </section>

      {/* ── Bloc 2 : Enjeux ── */}
      <section className="kova-pt-section kova-pt-section--craie">
        <div className="kova-pt-section__inner reveal" ref={ref}>
          <p className="kova-kicker">La pièce</p>
          <KovaHeading level="h2" className="kova-heading--nav">{data.enjeux.title}</KovaHeading>
          <div className="kova-pt-body">
            {enjeuxParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bloc 3 : Ce qu'on analyse ── */}
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
              {data.hero.ctaPrimary.label}
            </KovaButton>
          </div>
        </div>
      </section>

      {/* ── Bloc 4 : FAQ ── */}
      <section className="kova-faq">
        <div className="kova-faq__header reveal" ref={ref}>
          <p className="kova-kicker">Vos questions</p>
          <KovaHeading level="h2" className="kova-heading--nav">{data.faqTitle}</KovaHeading>
        </div>
        <div className="kova-faq__list">
          {data.faq.map((item, i) => (
            <details key={i} className="reveal" ref={ref} style={{ transitionDelay: `${i * 0.07}s` }}>
              <summary>{item.q}</summary>
              <p className="kova-faq__answer">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Bloc 5 : Articles liés (conditionnel) ── */}
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
              {relatedPosts.map((post) => (
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

      {/* ── Bloc 6 : CTA final ── */}
      <section className="kova-cta-final kova-cta-final--light">
        <div className="kova-cta-final__inner reveal" ref={ref}>
          <KovaHeading level="h2">{data.ctaFinal.title}</KovaHeading>
          <div className="kova-cta-final__buttons">
            <KovaButton
              variant="primary"
              href={data.ctaFinal.ctaPrimary.href}
              onClick={() => trackCta('final-primary')}
            >
              {data.ctaFinal.ctaPrimary.label}
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
