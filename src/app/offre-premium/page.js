import KovaNav         from "@/components/kova/KovaNav";
import KovaBadge       from "@/components/kova/KovaBadge";
import CheckList       from "@/components/kova/CheckList";
import PriceCalculator from "@/components/kova/PriceCalculator";
import KovaFooter      from "@/components/kova/KovaFooter";
import { OFFERS }      from "@/lib/config";

export const metadata = {
  title: "Je vous confie mon intérieur — Studio Kova",
  description:
    `Sélection meuble personnalisée, planche produits et liens d'achat. Livrée en 5 jours ouvrés. ${OFFERS.surmesure.display}/pièce.`,
};

const INCLUDED = [
  "Questionnaire approfondi et analyse de votre pièce",
  "Sélection meubles et objets avec liens d'achat selon votre budget",
  "Planche produits complète au format PDF",
  "Une révision incluse, livraison en 5 jours",
];

export default function OffrePremiumPage() {
  return (
    <>
      <KovaNav showBack backLabel="Accueil" backHref="/" />

      <div className="kova-product-page">

        <div
          className="kova-product-page__img"
          style={{ backgroundImage: "url('/lamp.webp')" }}
        >
          <div className="kova-product-page__img-overlay" />
          <span className="kova-product-page__badge">
            <KovaBadge variant="dark">Sur mesure</KovaBadge>
          </span>
          <div className="kova-product-page__price">
            <span className="kova-product-page__price-from">à partir de</span>
            {OFFERS.surmesure.stripePerPiece}€
            <span className="kova-product-page__price-unit">/pièce</span>
          </div>
        </div>

        <div className="kova-product-page__body">
          <h1 className="kova-product-page__title">Je vous confie mon intérieur</h1>
          <p className="kova-product-page__desc">
            Sélection complète de meubles et objets déco, avec liens d'achat prêts à commander.
          </p>
          <CheckList items={INCLUDED} />
        </div>

        <PriceCalculator />

      </div>

      <section className="kova-closer">
        <h2 className="kova-closer__title">Vous allez adorer rentrer chez vous</h2>
      </section>

      <KovaFooter />
    </>
  );
}
