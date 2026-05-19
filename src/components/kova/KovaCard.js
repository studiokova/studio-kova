import KovaBadge from "./KovaBadge";
import CheckList from "./CheckList";
import KovaButton from "./KovaButton";

// image: URL de l'image
// badge / badgeVariant: texte et style du badge ('gold'|'copper'|'dark')
// priceLabel: texte avant le prix (ex: "à partir de")
// price: montant affiché (ex: "299€")
// priceUnit: unité (ex: "/pièce")
// featured: bordure cuivre
// ctaVariant: variante du bouton ('primary'|'dark')
// onCtaClick: callback analytics
export default function KovaCard({
  image,
  badge,
  badgeVariant = "dark",
  priceLabel,
  price,
  priceUnit,
  title,
  description,
  features = [],
  ctaLabel = "C'est parti →",
  ctaHref,
  ctaVariant = "primary",
  featured,
  onCtaClick,
}) {
  return (
    <div className={`kova-card${featured ? " kova-card--featured" : ""}`}>
      <div
        className="kova-card__img"
        style={image ? { backgroundImage: `url('${image}')` } : undefined}
      >
        <div className="kova-card__img-overlay" />
        {badge && (
          <span className="kova-card__badge">
            <KovaBadge variant={badgeVariant}>{badge}</KovaBadge>
          </span>
        )}
        {price !== undefined && (
          <div className="kova-card__price">
            {priceLabel && (
              <span className="kova-card__price-label">{priceLabel}</span>
            )}
            {price}
            {priceUnit && (
              <span className="kova-card__price-label">{priceUnit}</span>
            )}
          </div>
        )}
      </div>

      <div className="kova-card__body">
        <div className="kova-card__title">{title}</div>
        {description && <p className="kova-card__desc">{description}</p>}
        {features.length > 0 && (
          <div className="kova-card__features">
            <CheckList items={features} />
          </div>
        )}
        <KovaButton
          variant={ctaVariant}
          href={ctaHref}
          onClick={onCtaClick}
          fullWidth
        >
          {ctaLabel}
        </KovaButton>
      </div>
    </div>
  );
}
