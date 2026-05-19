'use client'

export default function Chips({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
      {options.map((opt) => {
        const selected = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              padding: '7px 16px',
              borderRadius: 8,
              border: `1.5px solid ${selected ? 'var(--cuivre)' : 'var(--gris-clair)'}`,
              background: selected ? 'var(--cuivre)' : 'transparent',
              color: selected ? 'var(--craie)' : 'var(--sauge-fonce)',
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: 'inherit',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
