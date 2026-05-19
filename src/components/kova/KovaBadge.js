// variant: 'default'|'gold'|'copper'|'dark'|'eyebrow'|'eyebrow-light'
export default function KovaBadge({ variant = "default", className = "", children }) {
  const variantClass = variant === "default" ? "" : `kova-badge--${variant}`;
  const classes = ["kova-badge", variantClass, className].filter(Boolean).join(" ");
  return <span className={classes}>{children}</span>;
}
