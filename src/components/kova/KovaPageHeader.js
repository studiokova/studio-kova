export default function KovaPageHeader({ eyebrow, title, sub, narrow, wide }) {
  const mod = narrow ? " kova-page-header--narrow" : wide ? " kova-page-header--wide" : "";
  return (
    <div className={`kova-page-header${mod}`}>
      {eyebrow && <p className="kova-page-header__eyebrow">{eyebrow}</p>}
      <h1 className="kova-page-header__title">{title}</h1>
      {sub && <p className="kova-page-header__sub">{sub}</p>}
    </div>
  );
}
