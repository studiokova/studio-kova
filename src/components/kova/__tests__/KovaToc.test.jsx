import { render, screen, act } from '@testing-library/react';
import KovaToc from '../KovaToc';

const headings = [
  { id: 'etape-1', text: 'Étape 1' },
  { id: 'etape-2', text: 'Étape 2' },
];

let capturedObserverCallback;

beforeEach(() => {
  capturedObserverCallback = null;
  global.IntersectionObserver = jest.fn((cb) => {
    capturedObserverCallback = cb;
    return { observe: jest.fn(), disconnect: jest.fn() };
  });
});

afterEach(() => jest.clearAllMocks());

describe('KovaToc', () => {
  it('ne rend rien si headings est vide', () => {
    const { container } = render(<KovaToc headings={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('affiche tous les titres', () => {
    render(<KovaToc headings={headings} />);
    expect(screen.getByText('Étape 1')).toBeInTheDocument();
    expect(screen.getByText('Étape 2')).toBeInTheDocument();
  });

  it('génère les liens avec les bons hrefs', () => {
    render(<KovaToc headings={headings} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '#etape-1');
    expect(links[1]).toHaveAttribute('href', '#etape-2');
  });

  it('affiche le label Sommaire', () => {
    render(<KovaToc headings={headings} />);
    expect(screen.getByText('Sommaire')).toBeInTheDocument();
  });

  it('marque le lien actif quand une heading entre dans la vue', () => {
    const el1 = document.createElement('h2');
    el1.id = 'etape-1';
    const el2 = document.createElement('h2');
    el2.id = 'etape-2';
    document.body.appendChild(el1);
    document.body.appendChild(el2);

    render(<KovaToc headings={headings} />);
    act(() => {
      capturedObserverCallback([{ isIntersecting: true, target: { id: 'etape-1' } }]);
    });
    expect(screen.getByRole('link', { name: 'Étape 1' })).toHaveClass('kova-toc__link--active');

    document.body.removeChild(el1);
    document.body.removeChild(el2);
  });

  it('ne marque pas le lien actif si isIntersecting est false', () => {
    render(<KovaToc headings={headings} />);
    act(() => {
      capturedObserverCallback([{ isIntersecting: false, target: { id: 'etape-1' } }]);
    });
    expect(screen.getByRole('link', { name: 'Étape 1' })).not.toHaveClass('kova-toc__link--active');
  });
});
