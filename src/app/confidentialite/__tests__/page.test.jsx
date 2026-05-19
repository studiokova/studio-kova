import { render, screen } from '@testing-library/react';
import Confidentialite from '../page';

describe('Politique de confidentialité', () => {
  it('se rend sans erreur', () => {
    render(<Confidentialite />);
  });

  it('affiche le titre Politique de confidentialité', () => {
    render(<Confidentialite />);
    expect(screen.getByRole('heading', { level: 1, name: /Politique de confidentialit/ })).toBeInTheDocument();
  });

  it('affiche la navigation', () => {
    render(<Confidentialite />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('affiche le footer', () => {
    render(<Confidentialite />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
