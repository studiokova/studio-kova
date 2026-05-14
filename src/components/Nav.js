"use client";

export default function Nav({ showBack = false }) {
  return (
    <nav style={{
      position: "sticky",
      top: 0,
      height: "56px",
      background: "#F5EFE4",
      borderBottom: "0.5px solid #D3D1C7",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      zIndex: 100,
      boxSizing: "border-box",
    }}>
      <div style={{ width: "80px", flexShrink: 0 }}>
        {showBack && (
          <button
            onClick={() => window.history.back()}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              color: "#2E4A3A",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: 0,
              fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
              fontWeight: 400,
            }}
          >
            ← Retour
          </button>
        )}
      </div>

      <a
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
          marginLeft: "auto",
        }}
      >
        <svg viewBox="-14 -14 28 28" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
          <rect transform="translate(0,-8) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#B8612A"/>
          <rect transform="translate(8,0) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#2E4A3A"/>
          <rect transform="translate(-8,0) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#E8C97A"/>
          <rect transform="translate(0,8) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#6B9E7A"/>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, gap: "1px" }}>
          <span style={{ fontSize: "7.5px", fontWeight: 500, letterSpacing: "0.2em", color: "#6B9E7A", textTransform: "uppercase" }}>Studio</span>
          <span style={{ fontSize: "19px", fontWeight: 300, letterSpacing: "0.03em", color: "#2E4A3A" }}>Kova</span>
        </div>
      </a>
    </nav>
  );
}
