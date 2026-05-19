// size: 'sm'|'md'
// muted: texte en --gris
// light: texte clair pour fonds sombres
// sauge: texte --sauge-text pour sections sombres
export default function KovaText({ size = "md", muted, light, sauge, as: Tag = "p", className = "", children }) {
  const classes = [
    "kova-text",
    `kova-text--${size}`,
    muted ? "kova-text--muted" : "",
    light ? "kova-text--light" : "",
    sauge ? "kova-text--sauge" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes}>{children}</Tag>;
}
