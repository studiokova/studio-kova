import { render, screen } from '@testing-library/react';
import KovaHero from '../KovaHero';

describe('KovaHero', () => {
  it('se rend avec le titre obligatoire', () => {
    render(<KovaHero title="Mon titre" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Mon titre');
  });

  it('affiche le badge si fourni', () => {
    render(<KovaHero title="Titre" badge="Promo" />);
    expect(screen.getByText('Promo')).toBeInTheDocument();
  });

  it("n'affiche pas de badge si absent", () => {
    const { container } = render(<KovaHero title="Titre" />);
    expect(container.querySelector('.kova-hero__badge')).not.toBeInTheDocument();
  });

  it('affiche le sous-titre si fourni', () => {
    render(<KovaHero title="Titre" subtitle="Mon sous-titre" />);
    expect(screen.getByText('Mon sous-titre')).toBeInTheDocument();
  });

  it("n'affiche pas de sous-titre si absent", () => {
    const { container } = render(<KovaHero title="Titre" />);
    expect(container.querySelector('.kova-hero__sub')).not.toBeInTheDocument();
  });

  it('affiche le prix si fourni', () => {
    render(<KovaHero title="Titre" price="69€" />);
    expect(screen.getByText(/69/)).toBeInTheDocument();
  });

  it("n'affiche pas de prix si price est absent", () => {
    const { container } = render(<KovaHero title="Titre" />);
    expect(container.querySelector('.kova-hero__price')).not.toBeInTheDocument();
  });

  it('affiche le CTA primaire si fourni', () => {
    render(<KovaHero title="Titre" cta={{ label: 'Action', href: '/test' }} />);
    expect(screen.getByRole('link', { name: 'Action' })).toHaveAttribute('href', '/test');
  });

  it('affiche le CTA secondaire si fourni', () => {
    render(<KovaHero title="Titre" ctaSecondary={{ label: 'Secondaire', href: '/autre' }} />);
    expect(screen.getByRole('link', { name: 'Secondaire' })).toHaveAttribute('href', '/autre');
  });

  it("n'affiche pas les CTAs si absents", () => {
    const { container } = render(<KovaHero title="Titre" />);
    expect(container.querySelector('.kova-hero__ctas')).not.toBeInTheDocument();
  });

  it('applique le backgroundImage si image fournie', () => {
    const { container } = render(<KovaHero title="Titre" image="/test.webp" />);
    const bg = container.querySelector('.kova-hero__bg');
    expect(bg).toHaveStyle("background-image: url('/test.webp')");
  });

  it("n'applique pas de backgroundImage si image absente", () => {
    const { container } = render(<KovaHero title="Titre" />);
    const bg = container.querySelector('.kova-hero__bg');
    expect(bg).not.toHaveAttribute('style');
  });
});
