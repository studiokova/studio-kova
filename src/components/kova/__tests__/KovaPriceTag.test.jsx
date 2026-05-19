import { render, screen } from '@testing-library/react'
import KovaPriceTag from '../KovaPriceTag'

describe('KovaPriceTag', () => {
  it('affiche le montant', () => {
    render(<KovaPriceTag amount={49} />)
    expect(screen.getByText('49€')).toBeInTheDocument()
  })

  it('affiche "à partir de" quand from est true', () => {
    render(<KovaPriceTag from amount={299} />)
    expect(screen.getByText('à partir de')).toBeInTheDocument()
  })

  it('n\'affiche pas "à partir de" sans la prop from', () => {
    render(<KovaPriceTag amount={49} />)
    expect(screen.queryByText('à partir de')).not.toBeInTheDocument()
  })

  it('affiche l\'unité quand fournie', () => {
    render(<KovaPriceTag amount={299} unit="pièce" />)
    expect(screen.getByText('/pièce')).toBeInTheDocument()
  })

  it('n\'affiche pas l\'unité si non fournie', () => {
    render(<KovaPriceTag amount={49} />)
    expect(screen.queryByText(/^\//)).not.toBeInTheDocument()
  })

  it('affiche from + montant + unité ensemble', () => {
    render(<KovaPriceTag from amount={299} unit="pièce" />)
    expect(screen.getByText('à partir de')).toBeInTheDocument()
    expect(screen.getByText('299€')).toBeInTheDocument()
    expect(screen.getByText('/pièce')).toBeInTheDocument()
  })
})
