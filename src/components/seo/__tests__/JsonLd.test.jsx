import { render } from '@testing-library/react'
import { JsonLd } from '../JsonLd'

describe('JsonLd', () => {
  it('se rend sans erreur', () => {
    const { container } = render(<JsonLd data={{ '@type': 'WebPage' }} />)
    expect(container.querySelector('script[type="application/ld+json"]')).toBeInTheDocument()
  })

  it('sérialise les données en JSON valide', () => {
    const data = { '@type': 'Organization', name: 'Studio Kova', url: 'https://studiokova.fr' }
    const { container } = render(<JsonLd data={data} />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script.innerHTML).toBe(JSON.stringify(data))
  })

  it('gère les objets imbriqués', () => {
    const data = {
      '@type': 'Product',
      offers: { '@type': 'Offer', price: '49', priceCurrency: 'EUR' },
    }
    const { container } = render(<JsonLd data={data} />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const parsed = JSON.parse(script.innerHTML)
    expect(parsed.offers.price).toBe('49')
  })
})
