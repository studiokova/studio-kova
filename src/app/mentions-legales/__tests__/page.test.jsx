import { render, screen } from '@testing-library/react';
import MentionsLegales from '../page';

describe('Mentions légales', () => {
  it('se rend sans erreur', () => {
    render(<MentionsLegales />);
  });

  it('affiche le titre Mentions légales', () => {
    render(<MentionsLegales />);
    expect(screen.getByRole('heading', { level: 1, name: /Mentions légales/ })).toBeInTheDocument();
  });

  it('affiche la navigation', () => {
    render(<MentionsLegales />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('affiche le footer', () => {
    render(<MentionsLegales />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
