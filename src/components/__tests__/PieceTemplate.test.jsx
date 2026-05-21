import { render, screen } from '@testing-library/react';
import PieceTemplate from '../PieceTemplate';

jest.mock('@/lib/plausible', () => ({ track: jest.fn() }));

const mockData = {
  slug: 'chambre',
  hero: {
    h1: 'Décorer votre chambre',
    subtitle: 'Envoyez 3 photos et recevez votre diagnostic.',
    image: '/ok/A.webp',
    ctaPrimary: { label: 'Analyser ma chambre — 69€', href: '/analyse?piece=chambre' },
    ctaSecondary: { label: 'Faire le quiz', href: '/quiz' },
  },
  enjeux: {
    title: "Les enjeux d'une chambre réussie",
    body: "Premier paragraphe.\n\nDeuxième paragraphe.",
  },
  analyse: {
    title: "Ce que l'analyse examine",
    points: ['La lumière naturelle', "L'agencement du lit"],
  },
  faqTitle: 'Les questions sur la chambre',
  faq: [
    { q: 'Quelles couleurs choisir ?', a: 'Les tons doux sont apaisants.' },
    { q: 'Quel budget ?', a: '200 à 400€ pour un rafraîchissement.' },
  ],
  ctaFinal: {
    title: 'Prête à transformer votre chambre ?',
    ctaPrimary: { label: 'Analyser ma chambre — 69€', href: '/analyse?piece=chambre' },
    ctaSecondary: { label: "Voir l'aménagement clé en main", href: '/surmesure' },
  },
};

const mockRelatedPosts = [
  {
    slug: 'decorer-appartement-guide-complet',
    title: "Décorer son appartement : le guide complet",
    excerpt: "Par où commencer quand on veut décorer son appartement.",
    date: '20 mai 2026',
  },
  {
    slug: 'comment-choisir-sa-palette-de-couleurs',
    title: "Comment choisir sa palette de couleurs pour une pièce ?",
    excerpt: "La couleur change tout dans un intérieur.",
    date: '5 mai 2026',
  },
];

beforeEach(() => {
  global.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('PieceTemplate', () => {
  it('se rend sans erreur', () => {
    render(<PieceTemplate data={mockData} />);
  });

  it('affiche la navigation', () => {
    render(<PieceTemplate data={mockData} />);
    expect(screen.getAllByRole('navigation').length).toBeGreaterThan(0);
  });

  it('affiche le footer', () => {
    render(<PieceTemplate data={mockData} />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('affiche le H1 du hero', () => {
    render(<PieceTemplate data={mockData} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Décorer votre chambre' })).toBeInTheDocument();
  });

  it('affiche le sous-titre du hero', () => {
    render(<PieceTemplate data={mockData} />);
    expect(screen.getByText(/Envoyez 3 photos et recevez votre diagnostic/)).toBeInTheDocument();
  });

  it('affiche le CTA primaire du hero', () => {
    render(<PieceTemplate data={mockData} />);
    const links = screen.getAllByRole('link', { name: /Analyser ma chambre/i });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute('href', '/analyse?piece=chambre');
  });

  it('affiche le CTA secondaire du hero', () => {
    render(<PieceTemplate data={mockData} />);
    expect(screen.getByRole('link', { name: /Faire le quiz/i })).toHaveAttribute('href', '/quiz');
  });

  it('affiche le titre des enjeux', () => {
    render(<PieceTemplate data={mockData} />);
    expect(screen.getByText("Les enjeux d'une chambre réussie")).toBeInTheDocument();
  });

  it('découpe le corps éditorial en paragraphes', () => {
    render(<PieceTemplate data={mockData} />);
    expect(screen.getByText('Premier paragraphe.')).toBeInTheDocument();
    expect(screen.getByText('Deuxième paragraphe.')).toBeInTheDocument();
  });

  it('affiche le titre de la section analyse', () => {
    render(<PieceTemplate data={mockData} />);
    expect(screen.getByText("Ce que l'analyse examine")).toBeInTheDocument();
  });

  it('affiche tous les points analyse', () => {
    render(<PieceTemplate data={mockData} />);
    expect(screen.getByText('La lumière naturelle')).toBeInTheDocument();
    expect(screen.getByText("L'agencement du lit")).toBeInTheDocument();
  });

  it('affiche le titre de la FAQ', () => {
    render(<PieceTemplate data={mockData} />);
    expect(screen.getByText('Les questions sur la chambre')).toBeInTheDocument();
  });

  it('affiche les questions de la FAQ', () => {
    render(<PieceTemplate data={mockData} />);
    expect(screen.getByText('Quelles couleurs choisir ?')).toBeInTheDocument();
    expect(screen.getByText('Quel budget ?')).toBeInTheDocument();
  });

  it('affiche le bloc "Pour aller plus loin" quand plusieurs articles sont fournis', () => {
    render(<PieceTemplate data={mockData} relatedPosts={mockRelatedPosts} />);
    expect(screen.getByText('Articles sur cette pièce')).toBeInTheDocument();
  });

  it('affiche les titres des articles fournis', () => {
    render(<PieceTemplate data={mockData} relatedPosts={mockRelatedPosts} />);
    expect(screen.getByText("Décorer son appartement : le guide complet")).toBeInTheDocument();
    expect(screen.getByText("Comment choisir sa palette de couleurs pour une pièce ?")).toBeInTheDocument();
  });

  it('les liens des articles pointent vers les vrais slugs', () => {
    render(<PieceTemplate data={mockData} relatedPosts={mockRelatedPosts} />);
    const link = screen.getByRole('link', { name: /Décorer son appartement/i });
    expect(link).toHaveAttribute('href', '/blog/decorer-appartement-guide-complet');
  });

  it('affiche "À lire sur ce sujet" quand un seul article est fourni', () => {
    render(<PieceTemplate data={mockData} relatedPosts={[mockRelatedPosts[0]]} />);
    expect(screen.getByText('À lire sur ce sujet')).toBeInTheDocument();
  });

  it("n'affiche pas le bloc articles si relatedPosts est vide", () => {
    render(<PieceTemplate data={mockData} relatedPosts={[]} />);
    expect(screen.queryByText('Articles sur cette pièce')).not.toBeInTheDocument();
    expect(screen.queryByText('À lire sur ce sujet')).not.toBeInTheDocument();
  });

  it("n'affiche pas le bloc articles si relatedPosts est absent", () => {
    render(<PieceTemplate data={mockData} />);
    expect(screen.queryByText('Articles sur cette pièce')).not.toBeInTheDocument();
    expect(screen.queryByText('À lire sur ce sujet')).not.toBeInTheDocument();
  });

  it('affiche le titre du CTA final', () => {
    render(<PieceTemplate data={mockData} />);
    expect(screen.getByText('Prête à transformer votre chambre ?')).toBeInTheDocument();
  });

  it('affiche le CTA secondaire du CTA final', () => {
    render(<PieceTemplate data={mockData} />);
    expect(screen.getByRole('link', { name: /Voir l'aménagement clé en main/i })).toHaveAttribute('href', '/surmesure');
  });
});
