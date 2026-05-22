import KovaBadge from "./KovaBadge";
import KovaPriceTag from "./KovaPriceTag";
import KovaButton from "./KovaButton";

// image: URL du fond
// badge: texte optionnel (KovaBadge dark)
// title: ReactNode (supporte <em> pour la teinte ocre)
// subtitle: string
// price / priceUnit / priceFrom: affiche KovaPriceTag si défini
// cta: { label, href, onClick }
// ctaSecondary: { label, href } - bouton ghost optionnel
export default function KovaHero({
  image,
  badge,
  title,
  subtitle,
  price,
  priceUnit,
  priceFrom = true,
  cta,
  ctaSecondary,
}) {
  return (
    <section className="kova-hero">
      <div
        className="kova-hero__bg"
        style={image ? { backgroundImage: `url('${image}')` } : undefined}
      />
      <div className="kova-hero__overlay" />

      <div className="kova-hero__content">
        {badge && (
          <div className="kova-hero__badge">
            <KovaBadge variant="dark">{badge}</KovaBadge>
          </div>
        )}

        <h1 className="kova-heading kova-heading--h1 kova-heading--light kova-hero__title">
          {title}
        </h1>

        {subtitle && (
          <p className="kova-text kova-text--md kova-text--light kova-hero__sub">
            {subtitle}
          </p>
        )}

        {price !== undefined && (
          <div className="kova-hero__price">
            <KovaPriceTag from={priceFrom} amount={price} unit={priceUnit} />
          </div>
        )}

        {(cta || ctaSecondary) && (
          <div className="kova-hero__ctas">
            {cta && (
              <KovaButton
                variant="primary"
                href={cta.href}
                onClick={cta.onClick}
                fullWidth
              >
                {cta.label}
              </KovaButton>
            )}
            {ctaSecondary && (
              <KovaButton
                variant="ghost"
                href={ctaSecondary.href}
                onClick={ctaSecondary.onClick}
                fullWidth
              >
                {ctaSecondary.label}
              </KovaButton>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
