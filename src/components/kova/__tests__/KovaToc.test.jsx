import { render, screen } from '@testing-library/react';
import KovaToc from '../KovaToc';

const headings = [
  { id: 'etape-1', text: 'Étape 1' },
  { id: 'etape-2', text: 'Étape 2' },
];

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
});
