import { render, screen, fireEvent } from '@testing-library/react'
import KovaCard from '../KovaCard'

jest.mock('../CheckList', () => ({ items }) => <ul>{items.map((i, k) => <li key={k}>{i}</li>)}</ul>)
jest.mock('../KovaBadge', () => ({ children, variant }) => <span data-variant={variant}>{children}</span>)
jest.mock('../KovaButton', () => ({ children, href, onClick }) => <a href={href} onClick={onClick}>{children}</a>)

describe('KovaCard — affichage de base', () => {
  it('affiche le titre', () => {
    render(<KovaCard title="Je trouve mon style" ctaHref="/quiz" />)
    expect(screen.getByText('Je trouve mon style')).toBeInTheDocument()
  })

  it('affiche le CTA par défaut', () => {
    render(<KovaCard title="Test" ctaHref="/quiz" />)
    expect(screen.getByText("C'est parti →")).toBeInTheDocument()
  })

  it('affiche la description si fournie', () => {
    render(<KovaCard title="Test" description="Une belle offre" ctaHref="/quiz" />)
    expect(screen.getByText('Une belle offre')).toBeInTheDocument()
  })

  it('n\'affiche pas de description si absente', () => {
    render(<KovaCard title="Test" ctaHref="/quiz" />)
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })
})

describe('KovaCard — badge', () => {
  it('affiche le badge si fourni', () => {
    render(<KovaCard title="Test" badge="Populaire" ctaHref="/quiz" />)
    expect(screen.getByText('Populaire')).toBeInTheDocument()
  })

  it('n\'affiche pas de badge si absent', () => {
    render(<KovaCard title="Test" ctaHref="/quiz" />)
    expect(screen.queryByText('Populaire')).not.toBeInTheDocument()
  })
})

describe('KovaCard — prix', () => {
  it('affiche le prix si fourni', () => {
    render(<KovaCard title="Test" price="49€" ctaHref="/quiz" />)
    expect(screen.getByText('49€')).toBeInTheDocument()
  })

  it('affiche le priceLabel si fourni', () => {
    render(<KovaCard title="Test" price="299€" priceLabel="à partir de" ctaHref="/quiz" />)
    expect(screen.getByText('à partir de')).toBeInTheDocument()
  })

  it('affiche le priceUnit si fourni', () => {
    render(<KovaCard title="Test" price="299€" priceUnit="/pièce" ctaHref="/quiz" />)
    expect(screen.getByText('/pièce')).toBeInTheDocument()
  })

  it('n\'affiche pas le bloc prix si price est undefined', () => {
    render(<KovaCard title="Test" ctaHref="/quiz" />)
    expect(screen.queryByText('/pièce')).not.toBeInTheDocument()
  })
})

describe('KovaCard — features', () => {
  it('affiche la checklist si features est non vide', () => {
    render(<KovaCard title="Test" features={['Feature 1', 'Feature 2']} ctaHref="/quiz" />)
    expect(screen.getByText('Feature 1')).toBeInTheDocument()
    expect(screen.getByText('Feature 2')).toBeInTheDocument()
  })

  it('n\'affiche pas de checklist si features est vide', () => {
    render(<KovaCard title="Test" features={[]} ctaHref="/quiz" />)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})

describe('KovaCard — featured', () => {
  it('ajoute la classe kova-card--featured si featured est vrai', () => {
    const { container } = render(<KovaCard title="Test" featured ctaHref="/quiz" />)
    expect(container.firstChild).toHaveClass('kova-card--featured')
  })

  it('n\'ajoute pas la classe featured si featured est faux', () => {
    const { container } = render(<KovaCard title="Test" ctaHref="/quiz" />)
    expect(container.firstChild).not.toHaveClass('kova-card--featured')
  })
})

describe('KovaCard — image', () => {
  it('applique backgroundImage si image est fournie', () => {
    const { container } = render(<KovaCard title="Test" image="/photo.webp" ctaHref="/quiz" />)
    const imgDiv = container.querySelector('.kova-card__img')
    expect(imgDiv.style.backgroundImage).toContain('/photo.webp')
  })

  it('n\'applique pas backgroundImage si image est absente', () => {
    const { container } = render(<KovaCard title="Test" ctaHref="/quiz" />)
    const imgDiv = container.querySelector('.kova-card__img')
    expect(imgDiv.style.backgroundImage).toBe('')
  })
})

describe('KovaCard — onCtaClick', () => {
  it('appelle onCtaClick au clic sur le CTA', () => {
    const onClick = jest.fn()
    render(<KovaCard title="Test" ctaHref="/quiz" onCtaClick={onClick} />)
    fireEvent.click(screen.getByText("C'est parti →"))
    expect(onClick).toHaveBeenCalled()
  })
})
