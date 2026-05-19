import Image from "next/image";
import KovaNav    from "@/components/kova/KovaNav";
import KovaBadge  from "@/components/kova/KovaBadge";
import CheckList  from "@/components/kova/CheckList";
import KovaButton from "@/components/kova/KovaButton";
import KovaFooter from "@/components/kova/KovaFooter";
import { OFFERS, ANALYSE_LIVRABLES } from "@/lib/config";

export const metadata = {
  title: "Je transforme ma pièce — Studio Kova",
  description:
    `Analyse personnalisée de votre pièce avec palette de couleurs, priorités d'action et moodboard visuel. PDF livré en 48h. ${OFFERS.analyse.display}.`,
};

export default function JeTransformeMaPiecePage() {
  return (
    <>
      <KovaNav showBack backLabel="Accueil" backHref="/" />

      <div className="kova-product-page">

        <div
          className="kova-product-page__img"
          style={{ backgroundImage: "url('/shelves.webp')" }}
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
          <h1 className="kova-product-page__title">Je transforme ma pièce</h1>
          <p className="kova-product-page__desc">
            J'uploade la photo de ma pièce et je reçois un PDF avec des recommandations concrètes en 48h.
          </p>
          <CheckList items={ANALYSE_LIVRABLES} />

          <div className="kova-product-page__section">
            <span className="kova-product-page__eyebrow">EXEMPLE</span>
            <h2 className="kova-product-page__section-title">
              Voici ce que vous recevez
            </h2>
            <p className="kova-product-page__section-sub">
              Un PDF de 2 pages avec votre analyse complète.
            </p>
            <div className="kova-product-page__preview">
              <Image
                src="/email-apercu-pdf.png"
                alt="Exemple de livrable PDF Studio Kova — analyse déco et moodboard"
                width={600}
                height={424}
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
              Je transforme ma pièce →
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
