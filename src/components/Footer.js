export default function Footer() {
  return (
    <footer style={{
      background: "#2E4A3A",
      padding: "28px",
      textAlign: "center",
      lineHeight: 2,
      fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
    }}>
      <a
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
          lineHeight: 1,
          marginBottom: "8px",
        }}
      >
        <svg viewBox="-14 -14 28 28" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
          <rect transform="translate(0,-8) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#B8612A"/>
          <rect transform="translate(8,0) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#F5EFE4"/>
          <rect transform="translate(-8,0) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#E8C97A"/>
          <rect transform="translate(0,8) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#6B9E7A"/>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, gap: "2px", textAlign: "left" }}>
          <span style={{ fontSize: "7.5px", fontWeight: 500, letterSpacing: "0.2em", color: "#A8CCB8", textTransform: "uppercase" }}>Studio</span>
          <span style={{ fontSize: "19px", fontWeight: 300, letterSpacing: "0.03em", color: "#F5EFE4" }}>Kova</span>
        </div>
      </a>

      <div>
        <a
          href="mailto:hello@studiokova.fr"
          style={{ color: "#E8C97A", textDecoration: "none", fontSize: "14px", display: "block" }}
        >
          hello@studiokova.fr
        </a>
        <a
          href="https://instagram.com/studiokova.fr"
          style={{ color: "#A8CCB8", textDecoration: "none", fontSize: "13px", display: "block" }}
        >
          @studiokova.fr
        </a>
        <span style={{ color: "rgba(168,204,184,0.4)", fontSize: "11px", display: "block" }}>
          © 2025 Studio Kova
        </span>
      </div>
    </footer>
  );
}
