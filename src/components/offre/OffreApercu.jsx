import Image from 'next/image';

export default function OffreApercu() {
  return (
    <div className="kova-product-page__section">
      <span className="kova-product-page__eyebrow">EXEMPLE</span>
      <p className="kova-product-page__section-sub">
        Voici un exemple d&apos;analyse complète. C&apos;est exactement le format que vous
        recevez, adapté à votre pièce.
      </p>
      <div className="kova-product-page__preview">
        <Image
          src="/apercu-pdf-chambre.png"
          alt="Exemple de livrable PDF Studio Kova - analyse déco chambre"
          width={2968}
          height={1400}
          className="kova-product-page__preview-img"
        />
      </div>
    </div>
  );
}
