// from: affiche "à partir de" avant le montant
// amount: nombre (ex: 299)
// unit: unité (ex: "pièce" → "€/pièce")
export default function KovaPriceTag({ from, amount, unit }) {
  return (
    <div className="kova-price-tag">
      {from && <span className="kova-price-tag__from">à partir de</span>}
      <span className="kova-price-tag__amount">{amount}€</span>
      {unit && <span className="kova-price-tag__unit">/{unit}</span>}
    </div>
  );
}
