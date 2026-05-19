// variant: 'dark' (sur fond clair) | 'light' (sur fond sombre)
// size: largeur du SVG en px (défaut 28)
export default function KovaLogo({ variant = "dark", size = 28, href = "/" }) {
  const rightDiamond = variant === "light" ? "var(--craie)" : "var(--sauge-dk)";

  return (
    <a href={href} className={`kova-logo kova-logo--${variant}`}>
      <svg
        viewBox="-14 -14 28 28"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect transform="translate(0,-8) rotate(45)"  x="-4" y="-4" width="8" height="8" rx="1.5" fill="var(--cuivre)" />
        <rect transform="translate(8,0) rotate(45)"   x="-4" y="-4" width="8" height="8" rx="1.5" fill={rightDiamond} />
        <rect transform="translate(-8,0) rotate(45)"  x="-4" y="-4" width="8" height="8" rx="1.5" fill="var(--ocre)" />
        <rect transform="translate(0,8) rotate(45)"   x="-4" y="-4" width="8" height="8" rx="1.5" fill="var(--sauge-lt)" />
      </svg>
      <div className="kova-logo__type">
        <span className="kova-logo__studio">Studio</span>
        <span className="kova-logo__kova">Kova</span>
      </div>
    </a>
  );
}
