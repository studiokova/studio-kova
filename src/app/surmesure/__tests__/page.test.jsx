import { render, screen } from '@testing-library/react';
import SurmesurePage from '../page';

beforeAll(() => {
  delete window.location;
  window.location = { href: '' };
  process.env.NEXT_PUBLIC_CONTACT_EMAIL = 'hello@studiokova.fr';
});

describe('Page surmesure', () => {
  it('se rend sans erreur', () => {
    render(<SurmesurePage />);
  });

  it('affiche la navigation', () => {
    render(<SurmesurePage />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('affiche le footer', () => {
    render(<SurmesurePage />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('affiche le calculateur de prix', () => {
    render(<SurmesurePage />);
    expect(screen.getByText(/Total estim/)).toBeInTheDocument();
  });
});
