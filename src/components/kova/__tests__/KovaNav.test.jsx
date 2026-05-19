import { render, screen, fireEvent } from '@testing-library/react';
import KovaNav from '../KovaNav';

describe('KovaNav', () => {
  beforeEach(() => {
    window.history.back = jest.fn();
    delete window.location;
    window.location = { href: '' };
  });

  it('se rend sans erreur', () => {
    render(<KovaNav />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('a la classe kova-nav', () => {
    render(<KovaNav />);
    expect(screen.getByRole('navigation')).toHaveClass('kova-nav');
  });

  it("n'affiche pas de bouton retour par défaut (showBack=false)", () => {
    render(<KovaNav />);
    expect(screen.queryByText(/Retour/)).not.toBeInTheDocument();
  });

  it('affiche le bouton retour si showBack=true', () => {
    render(<KovaNav showBack />);
    expect(screen.getByText(/Retour/)).toBeInTheDocument();
  });

  it('affiche le backLabel personnalisé', () => {
    render(<KovaNav showBack backLabel="Accueil" />);
    expect(screen.getByText(/Accueil/)).toBeInTheDocument();
  });

  it('rend un <a> avec href si backHref est fourni', () => {
    render(<KovaNav showBack backLabel="Retour" backHref="/" />);
    const link = screen.getByRole('link', { name: /Retour/ });
    expect(link).toHaveAttribute('href', '/');
  });

  it('rend un <button> si aucun backHref', () => {
    render(<KovaNav showBack />);
    expect(screen.getByRole('button', { name: /Retour/ })).toBeInTheDocument();
  });

  it('appelle window.history.back() au clic si pas de backHref', () => {
    render(<KovaNav showBack />);
    fireEvent.click(screen.getByRole('button', { name: /Retour/ }));
    expect(window.history.back).toHaveBeenCalledTimes(1);
  });

  it('redirige via window.location.href si backHref fourni sur le bouton', () => {
    render(<KovaNav showBack backHref="/offre-premium" />);
    const link = screen.getByRole('link', { name: /Retour/ });
    expect(link).toHaveAttribute('href', '/offre-premium');
  });

  it('applique la classe dark', () => {
    render(<KovaNav dark />);
    expect(screen.getByRole('navigation')).toHaveClass('kova-nav--dark');
  });

  it("n'applique pas la classe dark par défaut", () => {
    render(<KovaNav />);
    expect(screen.getByRole('navigation')).not.toHaveClass('kova-nav--dark');
  });

  it('contient le logo Studio Kova', () => {
    render(<KovaNav />);
    expect(screen.getByText('Studio')).toBeInTheDocument();
    expect(screen.getByText('Kova')).toBeInTheDocument();
  });
});
