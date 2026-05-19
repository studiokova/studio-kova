// items: string[]
// light: variante pour fonds sombres (coches --ocre, texte --sauge-text)
// bordered: variante avec séparateurs entre items (fond craie, coches --cuivre)
export default function CheckList({ items = [], light, bordered }) {
  const cls = [
    "kova-checklist",
    light    ? "kova-checklist--light"    : "",
    bordered ? "kova-checklist--bordered" : "",
  ].filter(Boolean).join(" ");

  return (
    <ul className={cls}>
      {items.map((item, i) => (
        <li key={i} className="kova-checklist__item">
          <span className="kova-checklist__check">✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}
