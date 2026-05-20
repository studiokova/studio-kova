import { render, screen } from '@testing-library/react';
import KovaFooter from '../KovaFooter';

describe('KovaFooter', () => {
  it('se rend sans erreur', () => {
    render(<KovaFooter />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('a la classe kova-footer', () => {
    const { container } = render(<KovaFooter />);
    expect(container.querySelector('.kova-footer')).toBeInTheDocument();
  });

  it('affiche toujours le lien email', () => {
    render(<KovaFooter />);
    const emailLink = screen.getByRole('link', { name: /hello@studiokova\.fr/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:hello@studiokova.fr');
  });

  it('affiche toujours le lien Instagram', () => {
    const { container } = render(<KovaFooter />);
    const instaLink = container.querySelector('a[href*="instagram"]');
    expect(instaLink).not.toBeNull();
    expect(instaLink).toHaveAttribute('href', 'https://instagram.com/studiokova.fr');
    expect(instaLink).toHaveAttribute('target', '_blank');
    expect(instaLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('affiche le copyright', () => {
    render(<KovaFooter />);
    expect(screen.getByText(/© 2026 Studio Kova/)).toBeInTheDocument();
  });

  it('affiche les liens légaux', () => {
    render(<KovaFooter />);
    expect(screen.getByRole('link', { name: 'Mentions légales' })).toHaveAttribute('href', '/mentions-legales');
    expect(screen.getByRole('link', { name: 'Politique de confidentialité' })).toHaveAttribute('href', '/confidentialite');
  });

  it("n'affiche pas la tagline par défaut (full=false)", () => {
    render(<KovaFooter />);
    expect(screen.queryByText(/Conseil en décoration/)).not.toBeInTheDocument();
  });

  it('affiche la tagline si full=true', () => {
    render(<KovaFooter full />);
    expect(screen.getByText(/Conseil en décoration/)).toBeInTheDocument();
  });

  it("n'affiche pas les liens de nav par défaut", () => {
    render(<KovaFooter />);
    expect(screen.queryByRole('link', { name: 'Les offres' })).not.toBeInTheDocument();
  });

  it('affiche les liens de nav si full=true', () => {
    render(<KovaFooter full />);
    expect(screen.getByRole('link', { name: 'Les offres' })).toHaveAttribute('href', '/#offres');
    expect(screen.getByRole('link', { name: 'Comment ça marche' })).toHaveAttribute('href', '/#process');
    expect(screen.getByRole('link', { name: 'Témoignages' })).toHaveAttribute('href', '/#temoignages');
  });
});
