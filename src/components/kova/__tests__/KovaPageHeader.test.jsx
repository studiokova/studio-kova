import { render, screen } from '@testing-library/react';
import KovaPageHeader from '../KovaPageHeader';

describe('KovaPageHeader', () => {
  it('affiche le titre', () => {
    render(<KovaPageHeader title="Mon titre" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Mon titre' })).toBeInTheDocument();
  });

  it("affiche l'eyebrow si fourni", () => {
    render(<KovaPageHeader title="Test" eyebrow="Blog" />);
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it("n'affiche pas l'eyebrow si non fourni", () => {
    const { container } = render(<KovaPageHeader title="Test" />);
    expect(container.querySelector('.kova-page-header__eyebrow')).not.toBeInTheDocument();
  });

  it('affiche le sous-titre si fourni', () => {
    render(<KovaPageHeader title="Test" sub="Sous-titre de la page" />);
    expect(screen.getByText('Sous-titre de la page')).toBeInTheDocument();
  });

  it("n'affiche pas le sous-titre si non fourni", () => {
    const { container } = render(<KovaPageHeader title="Test" />);
    expect(container.querySelector('.kova-page-header__sub')).not.toBeInTheDocument();
  });

  it('applique la classe --narrow', () => {
    const { container } = render(<KovaPageHeader title="Test" narrow />);
    expect(container.querySelector('.kova-page-header--narrow')).toBeInTheDocument();
  });

  it('applique la classe --wide', () => {
    const { container } = render(<KovaPageHeader title="Test" wide />);
    expect(container.querySelector('.kova-page-header--wide')).toBeInTheDocument();
  });

  it('applique aucune classe modifier par défaut', () => {
    const { container } = render(<KovaPageHeader title="Test" />);
    expect(container.querySelector('.kova-page-header')).not.toHaveClass('kova-page-header--narrow');
    expect(container.querySelector('.kova-page-header')).not.toHaveClass('kova-page-header--wide');
  });
});
