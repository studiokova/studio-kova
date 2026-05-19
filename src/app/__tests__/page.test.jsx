import { render, screen, fireEvent, act } from '@testing-library/react';
import Home from '../page';

jest.mock('@/lib/plausible', () => ({ track: jest.fn() }))

let observerCallback
let mockObserve, mockUnobserve, mockDisconnect

beforeEach(() => {
  mockObserve = jest.fn()
  mockUnobserve = jest.fn()
  mockDisconnect = jest.fn()
  global.IntersectionObserver = jest.fn((callback) => {
    observerCallback = callback
    return { observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect }
  })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Homepage', () => {
  it('se rend sans erreur', () => {
    render(<Home />);
  });

  it('contient la navigation (KovaNav)', () => {
    render(<Home />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('contient le footer (KovaFooter)', () => {
    render(<Home />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('affiche le logo Studio Kova dans la nav', () => {
    render(<Home />);
    const navs = screen.getAllByText('Studio');
    expect(navs.length).toBeGreaterThan(0);
  });

  it('contient au moins un heading', () => {
    render(<Home />);
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('affiche le lien email dans le footer', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: /hello@studiokova\.fr/i })).toBeInTheDocument();
  });

  it('affiche les liens légaux dans le footer', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: 'Mentions légales' })).toBeInTheDocument();
  });

  it('affiche le titre hero', () => {
    render(<Home />);
    expect(screen.getByText(/La déco personnalisée/)).toBeInTheDocument();
  });

  it('affiche les trois offres', () => {
    render(<Home />);
    expect(screen.getByText('Je trouve mon style')).toBeInTheDocument();
    expect(screen.getByText('Je transforme ma pièce')).toBeInTheDocument();
    expect(screen.getByText('Je vous confie mon intérieur')).toBeInTheDocument();
  });

  it('affiche la section "Comment ça marche"', () => {
    render(<Home />);
    expect(screen.getByText(/De chez vous/)).toBeInTheDocument();
  });

  it('affiche les trois étapes du process', () => {
    render(<Home />);
    expect(screen.getByText('Je choisis mon offre')).toBeInTheDocument();
    expect(screen.getByText('Je partage mon espace')).toBeInTheDocument();
    expect(screen.getByText('Je reçois mon plan')).toBeInTheDocument();
  });

  it('affiche les témoignages', () => {
    render(<Home />);
    expect(screen.getByText('Marie T.')).toBeInTheDocument();
    expect(screen.getByText('Camille R.')).toBeInTheDocument();
  });
});

describe('Homepage — IntersectionObserver', () => {
  it('observe les éléments reveal au montage', () => {
    render(<Home />)
    expect(global.IntersectionObserver).toHaveBeenCalled()
    expect(mockObserve).toHaveBeenCalled()
  })

  it('déconnecte l\'observer au démontage', () => {
    const { unmount } = render(<Home />)
    unmount()
    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('ajoute la classe "visible" quand un élément entre dans le viewport', () => {
    render(<Home />)
    const target = document.createElement('div')
    act(() => {
      observerCallback([{ isIntersecting: true, target }])
    })
    expect(target.classList.contains('visible')).toBe(true)
    expect(mockUnobserve).toHaveBeenCalledWith(target)
  })

  it('n\'ajoute pas "visible" si l\'élément n\'est pas intersecting', () => {
    render(<Home />)
    const target = document.createElement('div')
    act(() => {
      observerCallback([{ isIntersecting: false, target }])
    })
    expect(target.classList.contains('visible')).toBe(false)
  })
})

describe('Homepage — CTA clicks', () => {
  it('déclenche le tracking au clic sur le CTA hero', () => {
    const { track } = require('@/lib/plausible')
    render(<Home />)
    const styleLinks = screen.getAllByRole('link', { name: /Je trouve mon style →/ })
    fireEvent.click(styleLinks[0])
    expect(track).toHaveBeenCalledWith('Hero CTA Clicked', { offer: 'free' })
  })

  it('déclenche le tracking au clic sur le CTA carte quiz', () => {
    const { track } = require('@/lib/plausible')
    render(<Home />)
    const ctaLinks = screen.getAllByRole('link', { name: /C'est parti/ })
    fireEvent.click(ctaLinks[0])
    expect(track).toHaveBeenCalledWith('Offers Section CTA Clicked', { offer: 'free' })
  })

  it('déclenche le tracking au clic sur le CTA carte analyse', () => {
    const { track } = require('@/lib/plausible')
    render(<Home />)
    const ctaLinks = screen.getAllByRole('link', { name: /C'est parti/ })
    fireEvent.click(ctaLinks[1])
    expect(track).toHaveBeenCalledWith('Offers Section CTA Clicked', { offer: 'analysis' })
  })

  it('déclenche le tracking au clic sur le CTA carte sur-mesure', () => {
    const { track } = require('@/lib/plausible')
    render(<Home />)
    const ctaLinks = screen.getAllByRole('link', { name: /C'est parti/ })
    fireEvent.click(ctaLinks[2])
    expect(track).toHaveBeenCalledWith('Offers Section CTA Clicked', { offer: 'premium' })
  })

  it('déclenche le tracking au clic sur le CTA final', () => {
    const { track } = require('@/lib/plausible')
    render(<Home />)
    const styleLinks = screen.getAllByRole('link', { name: /Je trouve mon style →/ })
    fireEvent.click(styleLinks[styleLinks.length - 1])
    expect(track).toHaveBeenCalledWith('Final CTA Clicked', { offer: 'free' })
  })
})
