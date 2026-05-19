import { render, screen, fireEvent } from '@testing-library/react'
import KovaTextarea from '../KovaTextarea'

describe('KovaTextarea', () => {
  it('se rend sans erreur', () => {
    render(<KovaTextarea />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('affiche le label quand fourni', () => {
    render(<KovaTextarea label="Mon label" />)
    expect(screen.getByText('Mon label')).toBeInTheDocument()
  })

  it('n\'affiche pas de label si absent', () => {
    const { container } = render(<KovaTextarea />)
    expect(container.querySelector('.kova-field__label')).not.toBeInTheDocument()
  })

  it('affiche le hint quand fourni', () => {
    render(<KovaTextarea hint="Information utile" />)
    expect(screen.getByText('Information utile')).toBeInTheDocument()
  })

  it('n\'affiche pas le hint si absent', () => {
    const { container } = render(<KovaTextarea />)
    expect(container.querySelector('.kova-field__helper')).not.toBeInTheDocument()
  })

  it('transmet le placeholder au textarea', () => {
    render(<KovaTextarea placeholder="Écrivez ici" />)
    expect(screen.getByPlaceholderText('Écrivez ici')).toBeInTheDocument()
  })

  it('accepte la saisie utilisateur', () => {
    render(<KovaTextarea />)
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Bonjour' } })
    expect(textarea).toBeInTheDocument()
  })

  it('transmet les autres props natives', () => {
    render(<KovaTextarea rows={5} maxLength={200} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('maxlength', '200')
  })
})
