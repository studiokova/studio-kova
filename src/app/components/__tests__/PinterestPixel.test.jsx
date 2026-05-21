import { render } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('next/script', () =>
  function MockScript({ id }) {
    return <script id={id} data-testid="pinterest-tag-script" />
  }
)

describe('PinterestPixel — TAG_ID non configuré', () => {
  it('ne rend rien quand NEXT_PUBLIC_PINTEREST_TAG_ID est absent', () => {
    const PinterestPixel = require('../PinterestPixel').default
    const { container } = render(<PinterestPixel />)
    expect(container.firstChild).toBeNull()
  })

  it('ne rend rien quand consent n\'est pas "accepted"', () => {
    const PinterestPixel = require('../PinterestPixel').default
    const { container } = render(<PinterestPixel />)
    expect(container.querySelector('[data-testid="pinterest-tag-script"]')).not.toBeInTheDocument()
  })
})
