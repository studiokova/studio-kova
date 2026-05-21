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
    expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0);
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

  it('affiche les 6 pièces', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: /chambre/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /salon/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cuisine/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /bureau/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /entr[eé]e/i })).toBeInTheDocument();
  });

  it('affiche le texte d\'instruction au-dessus de la grille', () => {
    render(<Home />);
    expect(screen.getByText('Choisissez la pièce à transformer')).toBeInTheDocument();
  });

  it('affiche les trois offres avec les nouveaux noms', () => {
    render(<Home />);
    expect(screen.getByText('Quiz de style')).toBeInTheDocument();
    expect(screen.getByText('Analyse IA + plan d\'action en 48h')).toBeInTheDocument();
    expect(screen.getByText('Aménagement clé en main')).toBeInTheDocument();
  });

  it('affiche la section comment fonctionne l\'analyse IA', () => {
    render(<Home />);
    expect(screen.getByText(/Comment fonctionne l/)).toBeInTheDocument();
  });

  it('affiche les étapes de l\'analyse IA', () => {
    render(<Home />);
    expect(screen.getByText('Vous envoyez 1 à 3 photos')).toBeInTheDocument();
    expect(screen.getByText('Vous recevez en 48h')).toBeInTheDocument();
  });

  it('affiche la FAQ', () => {
    render(<Home />);
    expect(screen.getByText(/Les questions que vous me posez/)).toBeInTheDocument();
    expect(screen.getByText(/Combien de temps pour recevoir mon analyse/)).toBeInTheDocument();
  });

  it('affiche le CTA final', () => {
    render(<Home />);
    expect(screen.getByText(/Prête à transformer votre pièce/)).toBeInTheDocument();
  });

  it('affiche les liens nav : Offres, Quiz', () => {
    render(<Home />);
    const quizLinks = screen.getAllByRole('link', { name: 'Quiz' });
    expect(quizLinks.length).toBeGreaterThan(0);
  });

  it('affiche le CTA nav Analyse IA', () => {
    render(<Home />);
    const ctaLinks = screen.getAllByRole('link', { name: /Analyse IA/ });
    expect(ctaLinks.length).toBeGreaterThan(0);
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
  it('déclenche "Clic pièce home" avec la pièce au clic sur une carte', () => {
    const { track } = require('@/lib/plausible')
    render(<Home />)
    const chambreLink = screen.getByRole('link', { name: /chambre/i })
    fireEvent.click(chambreLink)
    expect(track).toHaveBeenCalledWith('Clic pièce home', { piece: 'chambre' })
  })

  it('déclenche "Clic offre 49" au clic sur le CTA Analyser ma pièce', () => {
    const { track } = require('@/lib/plausible')
    render(<Home />)
    const analyseLink = screen.getByRole('link', { name: /Analyser ma pièce/ })
    fireEvent.click(analyseLink)
    expect(track).toHaveBeenCalledWith('Clic offre 49')
  })

  it('déclenche "Clic offre gratuite" au clic sur le CTA quiz', () => {
    const { track } = require('@/lib/plausible')
    render(<Home />)
    const quizLink = screen.getByRole('link', { name: /Faire le quiz →/ })
    fireEvent.click(quizLink)
    expect(track).toHaveBeenCalledWith('Clic offre gratuite')
  })

  it('déclenche "Clic offre 299" au clic sur Démarrer mon projet', () => {
    const { track } = require('@/lib/plausible')
    render(<Home />)
    const surmesureLink = screen.getByRole('link', { name: /Démarrer mon projet/ })
    fireEvent.click(surmesureLink)
    expect(track).toHaveBeenCalledWith('Clic offre 299')
  })

  it('déclenche "Clic blog header" au clic sur le lien Blog', () => {
    const { track } = require('@/lib/plausible')
    render(<Home />)
    const blogLinks = screen.getAllByRole('link', { name: 'Blog' })
    fireEvent.click(blogLinks[0])
    expect(track).toHaveBeenCalledWith('Clic blog header')
  })
})
