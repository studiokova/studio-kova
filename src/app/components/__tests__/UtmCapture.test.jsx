import { render, waitFor } from '@testing-library/react'
import UtmCapture from '../UtmCapture'

jest.mock('next/navigation', () => ({
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('@/lib/utmTracking', () => ({
  captureUtmsFromUrl: jest.fn(),
}))

describe('UtmCapture', () => {
  it('se rend sans produire de DOM visible', () => {
    const { container } = render(<UtmCapture />)
    expect(container.firstChild).toBeNull()
  })

  it('appelle captureUtmsFromUrl au montage', async () => {
    const { captureUtmsFromUrl } = require('@/lib/utmTracking')
    render(<UtmCapture />)
    await waitFor(() => {
      expect(captureUtmsFromUrl).toHaveBeenCalled()
    })
  })
})
