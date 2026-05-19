import { render, screen, fireEvent } from '@testing-library/react'
import CookieManageButton from '../CookieManageButton'

const mockOpenPreferences = jest.fn()

jest.mock('@/app/components/ConsentContext', () => ({
  useConsent: () => ({ openPreferences: mockOpenPreferences }),
}))

describe('CookieManageButton', () => {
  beforeEach(() => mockOpenPreferences.mockClear())

  it('se rend sans erreur', () => {
    render(<CookieManageButton />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('affiche "Gérer mes cookies"', () => {
    render(<CookieManageButton />)
    expect(screen.getByText('Gérer mes cookies')).toBeInTheDocument()
  })

  it('appelle openPreferences au clic', () => {
    render(<CookieManageButton />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockOpenPreferences).toHaveBeenCalledTimes(1)
  })

  it('souligne le texte au survol', () => {
    render(<CookieManageButton />)
    const btn = screen.getByRole('button')
    fireEvent.mouseEnter(btn)
    expect(btn.style.textDecoration).toBe('underline')
  })

  it('retire le soulignement en quittant', () => {
    render(<CookieManageButton />)
    const btn = screen.getByRole('button')
    fireEvent.mouseEnter(btn)
    fireEvent.mouseLeave(btn)
    expect(btn.style.textDecoration).toBe('none')
  })
})
