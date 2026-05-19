// level: 'h1'|'h2'|'h3'|'h4'
// italic, light, muted: modificateurs visuels
export default function KovaHeading({ level = "h2", italic, light, muted, className = "", children }) {
  const Tag = level;
  const classes = [
    "kova-heading",
    `kova-heading--${level}`,
    italic ? "kova-heading--italic" : "",
    light  ? "kova-heading--light"  : "",
    muted  ? "kova-heading--muted"  : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes}>{children}</Tag>;
}
