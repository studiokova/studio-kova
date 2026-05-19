import { render, screen, fireEvent } from '@testing-library/react';
import KovaButton from '../KovaButton';

describe('KovaButton', () => {
  it('se rend sans erreur', () => {
    render(<KovaButton>Cliquer</KovaButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('rend un <button> par défaut', () => {
    render(<KovaButton>Test</KovaButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('rend un <a> quand href est fourni', () => {
    render(<KovaButton href="/page">Lien</KovaButton>);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/page');
  });

  it('rend un <button> désactivé quand href + disabled', () => {
    render(<KovaButton href="/page" disabled>Test</KovaButton>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('applique la classe de variante', () => {
    render(<KovaButton variant="secondary">Test</KovaButton>);
    expect(screen.getByRole('button')).toHaveClass('kova-btn--secondary');
  });

  it('applique la variante primary par défaut', () => {
    render(<KovaButton>Test</KovaButton>);
    expect(screen.getByRole('button')).toHaveClass('kova-btn--primary');
  });

  it('applique la classe kova-btn de base', () => {
    render(<KovaButton>Test</KovaButton>);
    expect(screen.getByRole('button')).toHaveClass('kova-btn');
  });

  it('applique la classe fullWidth', () => {
    render(<KovaButton fullWidth>Test</KovaButton>);
    expect(screen.getByRole('button')).toHaveClass('kova-btn--full');
  });

  it('applique la classe disabled', () => {
    render(<KovaButton disabled>Test</KovaButton>);
    expect(screen.getByRole('button')).toHaveClass('kova-btn--disabled');
  });

  it('appelle onClick au clic', () => {
    const onClick = jest.fn();
    render(<KovaButton onClick={onClick}>Test</KovaButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('affiche les children', () => {
    render(<KovaButton>Mon texte</KovaButton>);
    expect(screen.getByText('Mon texte')).toBeInTheDocument();
  });

  it('accepte une className additionnelle', () => {
    render(<KovaButton className="extra">Test</KovaButton>);
    expect(screen.getByRole('button')).toHaveClass('extra');
  });

  it('applique target et rel sur le lien', () => {
    render(
      <KovaButton href="https://example.com" target="_blank" rel="noopener noreferrer">
        Lien externe
      </KovaButton>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
