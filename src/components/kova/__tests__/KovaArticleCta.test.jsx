import { render, screen } from '@testing-library/react';
import KovaArticleCta from '../KovaArticleCta';

describe('KovaArticleCta', () => {
  it('affiche le contenu quiz par défaut', () => {
    render(<KovaArticleCta />);
    expect(screen.getByText(/Trouvez votre style/i)).toBeInTheDocument();
  });

  it('affiche le lien quiz par défaut', () => {
    render(<KovaArticleCta />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/quiz');
  });

  it('affiche le contenu analyse quand type="analyse"', () => {
    render(<KovaArticleCta type="analyse" />);
    expect(screen.getByText(/pièce qui ne fonctionne pas/i)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/analyse');
  });

  it('affiche le contenu surmesure quand type="surmesure"', () => {
    render(<KovaArticleCta type="surmesure" />);
    expect(screen.getByText(/pièces à transformer/i)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/surmesure');
  });

  it('retombe sur quiz pour un type inconnu', () => {
    render(<KovaArticleCta type="inconnu" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/quiz');
  });
});
