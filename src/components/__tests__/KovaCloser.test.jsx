import { render, screen } from '@testing-library/react';
import KovaCloser from '../KovaCloser';

describe('KovaCloser', () => {
  it('se rend sans erreur', () => {
    render(<KovaCloser />);
  });

  it('affiche le titre', () => {
    render(<KovaCloser />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Vous allez adorer rentrer chez vous'
    );
  });

  it('est rendu dans une section avec la classe kova-closer', () => {
    const { container } = render(<KovaCloser />);
    expect(container.querySelector('section.kova-closer')).toBeInTheDocument();
  });
});
