import Image from "next/image";
import KovaNav    from "@/components/kova/KovaNav";
import KovaBadge  from "@/components/kova/KovaBadge";
import KovaButton from "@/components/kova/KovaButton";
import KovaFooter from "@/components/kova/KovaFooter";
import OffreDetail from "@/components/offre/OffreDetail";
import { OFFERS } from "@/lib/config";

export const metadata = {
  title: "Je transforme ma pièce - Studio Kova",
  description:
    `Analyse personnalisée de votre pièce avec palette de couleurs, priorités d'action et moodboard visuel. PDF livré en 48h. ${OFFERS.analyse.display}.`,
};

export default function JeTransformeMaPiecePage() {
  return (
    <>
      <KovaNav full />

      <div className="kova-product-page">

        <div
          className="kova-product-page__img"
          style={{ backgroundImage: "url('/images/site/shelves.webp')" }}
        >
          <div className="kova-product-page__img-overlay" />
          <span className="kova-product-page__badge">
            <KovaBadge variant="copper">Populaire</KovaBadge>
          </span>
          <div className="kova-product-page__price">
            {OFFERS.analyse.display}
          </div>
        </div>

        <div className="kova-product-page__body">
          <h1 className="kova-product-page__title">Transformez votre pièce en 48h</h1>
          <p className="kova-product-page__desc">
            Vous envoyez les photos de votre pièce, vous recevez un plan déco complet
            sous 48h. {OFFERS.analyse.display}.
          </p>
          <div className="kova-product-page__hero-cta">
            <KovaButton variant="primary" href="/analyse" fullWidth>
              Analyser ma pièce - {OFFERS.analyse.display} →
            </KovaButton>
            <p className="kova-product-page__microcopy">
              Livré sous 48h · paiement sécurisé
            </p>
          </div>

          <OffreDetail piece={null} dark />

          <div className="kova-product-page__section">
            <span className="kova-product-page__eyebrow">EXEMPLE</span>
            <p className="kova-product-page__section-sub">
              Voici un exemple d&apos;analyse complète. C&apos;est exactement le format que vous
              recevez, adapté à votre pièce.
            </p>
            <div className="kova-product-page__preview">
              <Image
                src="/apercu-pdf-chambre.webp"
                alt="Exemple de livrable PDF Studio Kova - analyse déco chambre"
                width={2968}
                height={1400}
                className="kova-product-page__preview-img"
              />
            </div>
          </div>
        </div>

        <section className="kova-sell-cta">
          <div className="kova-sell-cta__inner">
            <span className="kova-badge kova-badge--eyebrow-light">LANCER L'ANALYSE</span>
            <h2 className="kova-heading kova-heading--h2 kova-heading--light">
              Prête à transformer votre pièce&nbsp;?
            </h2>
            <p className="kova-sell-cta__sub">
              {OFFERS.analyse.display}, paiement sécurisé, PDF livré sous 48h.
            </p>
            <KovaButton variant="primary" href="/analyse" fullWidth>
              Analyser ma pièce - {OFFERS.analyse.display} →
            </KovaButton>
            <p className="kova-sell-cta__contact">
              Une question ? Écrivez-moi à{" "}
              <a
                href="mailto:hello@studiokova.fr?subject=Question sur l'offre analyse"
                className="kova-sell-cta__email"
              >
                hello@studiokova.fr
              </a>
            </p>
          </div>
        </section>

      </div>

      <section className="kova-closer">
        <h2 className="kova-closer__title">Vous allez adorer rentrer chez vous</h2>
      </section>

      <KovaFooter />
    </>
  );
}
