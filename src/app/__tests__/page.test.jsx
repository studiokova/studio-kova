import { render, screen } from '@testing-library/react';
import Home from '../page';

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
});
