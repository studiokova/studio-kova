import { render, screen } from '@testing-library/react'
import ConfirmationPage from '../page'

jest.mock('../ConfirmationContent', () => () => (
  <div data-testid="confirmation-content">Contenu de confirmation</div>
))

describe('ConfirmationPage', () => {
  it('se rend sans erreur', () => {
    render(<ConfirmationPage />)
  })

  it('affiche le composant ConfirmationContent', () => {
    render(<ConfirmationPage />)
    expect(screen.getByTestId('confirmation-content')).toBeInTheDocument()
  })
})
