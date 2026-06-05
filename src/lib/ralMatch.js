import { RAL } from 'ral-colors'
import { converter, differenceCiede2000 } from 'culori'

// CIEDE2000 operates in Lab65 (D65 illuminant) — culori uses this internally
const toLab65 = converter('lab65')
const differenceFunc = differenceCiede2000()

// Build flat table: [{ code, hex, nom }] — RAL Design only (1825 teintes, meilleures nuances désaturées)
let _table = null
function getTable() {
  if (_table) return _table
  _table = Object.entries(RAL.design_system).map(([code, entry]) => {
    const { r, g, b } = entry.rgb
    return {
      code,
      nom: entry.description,
      hex: rgbToHex(r, g, b),
      lab: toLab65({ mode: 'rgb', r: r / 255, g: g / 255, b: b / 255 }),
    }
  })
  return _table
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function hexToRgb(hex) {
  const clean = hex.replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null
  return {
    r: parseInt(clean.slice(0, 2), 16) / 255,
    g: parseInt(clean.slice(2, 4), 16) / 255,
    b: parseInt(clean.slice(4, 6), 16) / 255,
  }
}

/**
 * Retourne le RAL Design le plus proche d'un hex donné, via distance CIEDE2000.
 * @param {string} hex — ex. "#B8612A"
 * @returns {{ code: string, nom: string, hex: string } | null}
 */
export function ralMatch(hex) {
  if (!hex || typeof hex !== 'string') return null
  try {
    const rgb = hexToRgb(hex)
    if (!rgb) return null

    const inputLab = toLab65({ mode: 'rgb', ...rgb })
    if (!inputLab) return null

    const table = getTable()
    let best = null
    let bestDist = Infinity

    for (const entry of table) {
      const dist = differenceFunc(inputLab, entry.lab)
      if (dist < bestDist) {
        bestDist = dist
        best = entry
      }
    }

    if (!best || !best.code) return null
    return { code: best.code, nom: best.nom, hex: best.hex }
  } catch (err) {
    console.error('[ralMatch] Erreur calcul RAL pour', hex, err.message)
    return null
  }
}
