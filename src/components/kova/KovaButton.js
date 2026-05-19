"use client";

// variant: 'primary'|'secondary'|'dark'|'light'|'ghost'|'outline-light'
// fullWidth: booléen
// href: rend un <a>; sinon <button>
// onClick: callback
// disabled: désactive et assombrit le bouton
export default function KovaButton({
  variant = "primary",
  fullWidth,
  href,
  onClick,
  target,
  rel,
  type = "button",
  disabled,
  className = "",
  children,
}) {
  const classes = [
    "kova-btn",
    `kova-btn--${variant}`,
    fullWidth   ? "kova-btn--full"     : "",
    disabled    ? "kova-btn--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href && !disabled) {
    return (
      <a href={href} className={classes} onClick={onClick} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
