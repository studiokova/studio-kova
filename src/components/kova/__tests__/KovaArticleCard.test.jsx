import { render, screen } from '@testing-library/react';
import KovaArticleCard from '../KovaArticleCard';

describe('KovaArticleCard', () => {
  it('affiche le titre', () => {
    render(<KovaArticleCard href="/blog/test" title="Mon article" />);
    expect(screen.getByText('Mon article')).toBeInTheDocument();
  });

  it('affiche la date si fournie', () => {
    render(<KovaArticleCard href="/blog/test" title="Test" date="15 mai 2026" />);
    expect(screen.getByText('15 mai 2026')).toBeInTheDocument();
  });

  it("n'affiche pas la date si non fournie", () => {
    render(<KovaArticleCard href="/blog/test" title="Test" />);
    expect(screen.queryByText(/mai/)).not.toBeInTheDocument();
  });

  it('affiche le lien avec le bon href', () => {
    render(<KovaArticleCard href="/blog/test" title="Test" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/test');
  });

  it("affiche l'excerpt si fourni", () => {
    render(<KovaArticleCard href="/blog/test" title="Test" excerpt="Mon résumé" />);
    expect(screen.getByText('Mon résumé')).toBeInTheDocument();
  });

  it("n'affiche pas l'excerpt si non fourni", () => {
    render(<KovaArticleCard href="/blog/test" title="Test" />);
    expect(screen.queryByText('Mon résumé')).not.toBeInTheDocument();
  });
});
