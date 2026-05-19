import { render } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('next/script', () =>
  function MockScript({ id }) {
    return <script id={id} data-testid="meta-pixel-script" />
  }
)

describe('MetaPixel — PIXEL_ID non configuré', () => {
  it('ne rend rien quand NEXT_PUBLIC_META_PIXEL_ID est absent', () => {
    const MetaPixel = require('../MetaPixel').default
    const { container } = render(<MetaPixel />)
    expect(container.firstChild).toBeNull()
  })

  it('ne rend rien quand consent n\'est pas "accepted"', () => {
    const MetaPixel = require('../MetaPixel').default
    const { container } = render(<MetaPixel />)
    expect(container.querySelector('[data-testid="meta-pixel-script"]')).not.toBeInTheDocument()
  })
})
