'use client'

const STYLES = {
  error:   { bg: '#FAECE7', border: '#F5C4B3', color: '#993C1D' },
  success: { bg: '#EAF3DE', border: '#C0DD97', color: '#3B6D11' },
  info:    { bg: '#F1EFE8', border: '#D3D1C7', color: '#444441' },
}

const strokeProps = { fill: 'none', stroke: 'currentColor', strokeWidth: '1.75', strokeLinecap: 'round', strokeLinejoin: 'round' }
const iconStyle   = { flexShrink: 0 }

const ICONS = {
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" style={iconStyle} {...strokeProps}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" style={iconStyle} {...strokeProps}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" style={iconStyle} {...strokeProps}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
}

// type: 'error' | 'success' | 'info'
// message: string
// onDismiss: fonction optionnelle — affiche une croix si fournie
export default function KovaAlert({ type = 'error', message, onDismiss }) {
  const s = STYLES[type]
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        borderRadius: 'var(--border-radius-md, 8px)',
        border: `0.5px solid ${s.border}`,
        background: s.bg,
        color: s.color,
        fontSize: 13,
      }}
    >
      {ICONS[type]}
      <span style={{ flex: 1 }}>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fermer"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.6, padding: 0, fontSize: 16, lineHeight: 1 }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
        >
          ✕
        </button>
      )}
    </div>
  )
}
