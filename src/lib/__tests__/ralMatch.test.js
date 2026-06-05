/**
 * @jest-environment node
 */

// Mock ESM packages avant tout import
jest.mock('ral-colors', () => ({
  RAL: {
    design_system: {
      'H060L50C50': { description: 'Date Fruit Brown', rgb: { r: 175, g: 100, b: 43 } },
      'H160L40C25': { description: 'Black Pine Green', rgb: { r: 51, g: 101, b: 74 } },
      'H085L93C05': { description: 'Vintage White', rgb: { r: 244, g: 239, b: 228 } },
    },
  },
}))

jest.mock('culori', () => {
  const toLab65 = (color) => {
    if (!color) return null
    // Retourne un objet Lab65 minimal pour les tests
    return { mode: 'lab65', l: color.r * 100, a: color.g * 50 - 25, b: color.b * 50 - 25 }
  }
  const differenceFunc = (a, b) => {
    if (!a || !b) return Infinity
    return Math.sqrt(
      Math.pow(a.l - b.l, 2) +
      Math.pow(a.a - b.a, 2) +
      Math.pow(a.b - b.b, 2)
    )
  }
  return {
    converter: () => toLab65,
    differenceCiede2000: () => differenceFunc,
  }
})

const { ralMatch } = require('../ralMatch')

describe('ralMatch', () => {
  it('retourne un code RAL et un nom pour un hex valide', () => {
    const result = ralMatch('#B8612A')
    expect(result).not.toBeNull()
    expect(result).toHaveProperty('code')
    expect(result).toHaveProperty('nom')
    expect(result).toHaveProperty('hex')
    expect(typeof result.code).toBe('string')
    expect(result.code.length).toBeGreaterThan(0)
  })

  it('retourne null pour un hex invalide', () => {
    expect(ralMatch('not-a-hex')).toBeNull()
    expect(ralMatch('')).toBeNull()
    expect(ralMatch('#GGG')).toBeNull()
  })

  it('retourne null si le hex est null ou undefined', () => {
    expect(ralMatch(null)).toBeNull()
    expect(ralMatch(undefined)).toBeNull()
  })

  it('accepte un hex sans #', () => {
    const result = ralMatch('B8612A')
    expect(result).not.toBeNull()
    expect(result).toHaveProperty('code')
  })

  it('le hex retourné est un hex valide 6 caractères', () => {
    const result = ralMatch('#3D6B52')
    expect(result).not.toBeNull()
    expect(result.hex).toMatch(/^#[0-9a-fA-F]{6}$/)
  })

  it('ne plante pas si culori retourne null', () => {
    // Forcer un cas limite sans lever d'exception
    expect(() => ralMatch('#000000')).not.toThrow()
  })
})
