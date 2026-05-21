import { render, screen } from '@testing-library/react';

beforeAll(() => {
  delete window.location;
  window.location = { href: '' };
  process.env.NEXT_PUBLIC_CONTACT_EMAIL = 'hello@studiokova.fr';
});

// Import après avoir posé les mocks d'env
let OffrePremiumPage;
beforeAll(async () => {
  ({ default: OffrePremiumPage } = await import('../page'));
});

describe('Page Offre Premium', () => {
  it('se rend sans erreur', () => {
    render(<OffrePremiumPage />);
  });

  it('contient la navigation (KovaNav)', () => {
    render(<OffrePremiumPage />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('contient le footer (KovaFooter)', () => {
    render(<OffrePremiumPage />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('affiche le titre principal', () => {
    render(<OffrePremiumPage />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('affiche la checklist des livrables', () => {
    render(<OffrePremiumPage />);
    expect(screen.getByText('Questionnaire approfondi et analyse de votre pièce')).toBeInTheDocument();
    expect(screen.getByText('Une révision incluse, livraison en 5 jours')).toBeInTheDocument();
  });

  it('contient le calculateur de prix', () => {
    render(<OffrePremiumPage />);
    expect(screen.getByText(/Total estimé/)).toBeInTheDocument();
  });

  it('affiche le bouton de commande', () => {
    render(<OffrePremiumPage />);
    expect(screen.getByText(/Démarrer mon projet/)).toBeInTheDocument();
  });

  it('le logo nav pointe vers "/"', () => {
    render(<OffrePremiumPage />);
    const homeLinks = screen.getAllByRole('link').filter(l => l.getAttribute('href') === '/');
    expect(homeLinks.length).toBeGreaterThan(0);
  });
});
