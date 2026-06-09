import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AnalysePage from '../page';

jest.mock('@vercel/blob/client', () => ({ upload: jest.fn() }));
jest.mock('@/lib/plausible', () => ({ track: jest.fn(), getSource: jest.fn(() => 'direct') }));
jest.mock('@/lib/utmTracking', () => ({ getStoredUtms: jest.fn(() => ({})) }));
jest.mock('@/components/kova/KovaStepShell', () => ({ children, currentStep, totalSteps }) => (
  <div data-testid="step-shell" data-step={currentStep} data-total={totalSteps}>{children}</div>
));
jest.mock('@/components/kova/KovaFooter', () => () => <footer role="contentinfo" />);
jest.mock('@/lib/config', () => ({
  OFFERS: { analyse: { amount: 9700, display: '97€' } },
  ANALYSE_LIVRABLES: ['Diagnostic complet', 'PDF personnalisé'],
}));

window.scrollTo = jest.fn();
URL.createObjectURL = jest.fn(() => 'blob:mock-url');
URL.revokeObjectURL = jest.fn();

function selectionnerStep1() {
  fireEvent.click(screen.getByText('Refaire la déco'));
  fireEvent.click(screen.getByText('Chambre'));
  fireEvent.click(screen.getByText('300–800€'));
}

describe('AnalysePage — rendu initial', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { search: '', href: '' };
    jest.clearAllMocks();
  });

  it('se rend sans erreur', () => {
    render(<AnalysePage />);
    expect(screen.getByTestId('step-shell')).toBeInTheDocument();
  });

  it('démarre à l\'étape 1 sur 3', () => {
    render(<AnalysePage />);
    const shell = screen.getByTestId('step-shell');
    expect(shell).toHaveAttribute('data-step', '1');
    expect(shell).toHaveAttribute('data-total', '3');
  });

  it('affiche le titre de l\'étape 1', () => {
    render(<AnalysePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Parlez-moi de cette pièce');
  });

  it('affiche les options de cas d\'usage', () => {
    render(<AnalysePage />);
    expect(screen.getByText('Refaire les surfaces')).toBeInTheDocument();
    expect(screen.getByText('Refaire la déco')).toBeInTheDocument();
    expect(screen.getByText('Tout refaire / meubler')).toBeInTheDocument();
  });

  it('le bouton Continuer est désactivé sans sélection', () => {
    render(<AnalysePage />);
    expect(screen.getByRole('button', { name: 'Continuer →' })).toBeDisabled();
  });

  it('le bouton Précédent n\'est pas affiché à l\'étape 1', () => {
    render(<AnalysePage />);
    expect(screen.queryByText('← Précédent')).not.toBeInTheDocument();
  });

  it('affiche le footer', () => {
    render(<AnalysePage />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});

describe('AnalysePage — tracking', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { search: '', href: '' };
    jest.clearAllMocks();
  });

  it('track "Analysis Page Viewed" au montage', () => {
    const { track } = require('@/lib/plausible');
    render(<AnalysePage />);
    expect(track).toHaveBeenCalledWith('Analysis Page Viewed', expect.objectContaining({ source: 'direct' }));
  });

  it('inclut la piece dans le tracking si présente dans l\'URL', () => {
    window.location = { search: '?piece=salon', href: '' };
    const { track } = require('@/lib/plausible');
    render(<AnalysePage />);
    expect(track).toHaveBeenCalledWith('Analysis Page Viewed', expect.objectContaining({ piece: 'salon' }));
  });

  it('n\'inclut pas piece dans le tracking si absente de l\'URL', () => {
    window.location = { search: '', href: '' };
    const { track } = require('@/lib/plausible');
    render(<AnalysePage />);
    const call = track.mock.calls[0];
    expect(call[1]).not.toHaveProperty('piece');
  });

  it('track "Analysis Room Completed" au passage à l\'étape 2', () => {
    const { track } = require('@/lib/plausible');
    render(<AnalysePage />);
    selectionnerStep1();
    fireEvent.click(screen.getByRole('button', { name: 'Continuer →' }));
    expect(track).toHaveBeenCalledWith('Analysis Room Completed', expect.objectContaining({
      room_type: 'Chambre',
      budget_range: '300–800€',
      cas_usage: 'deco',
    }));
  });
});

describe('AnalysePage — navigation étape 1 → 2', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { search: '', href: '' };
    jest.clearAllMocks();
  });

  it('le bouton Continuer se déverrouille quand cas_usage + type + budget sont sélectionnés', () => {
    render(<AnalysePage />);
    selectionnerStep1();
    expect(screen.getByRole('button', { name: 'Continuer →' })).not.toBeDisabled();
  });

  it('affiche l\'étape 2 (style) après validation de l\'étape 1', () => {
    render(<AnalysePage />);
    selectionnerStep1();
    fireEvent.click(screen.getByRole('button', { name: 'Continuer →' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Votre style pour cette pièce');
  });

  it('affiche le bouton Précédent à l\'étape 2', () => {
    render(<AnalysePage />);
    selectionnerStep1();
    fireEvent.click(screen.getByRole('button', { name: 'Continuer →' }));
    expect(screen.getByText('← Précédent')).toBeInTheDocument();
  });

  it('revient à l\'étape 1 en cliquant Précédent', () => {
    render(<AnalysePage />);
    selectionnerStep1();
    fireEvent.click(screen.getByRole('button', { name: 'Continuer →' }));
    fireEvent.click(screen.getByText('← Précédent'));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Parlez-moi de cette pièce');
  });
});

describe('AnalysePage — navigation étape 2 → 3', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { search: '', href: '' };
    jest.clearAllMocks();
  });

  async function allerEtape2() {
    render(<AnalysePage />);
    selectionnerStep1();
    fireEvent.click(screen.getByRole('button', { name: 'Continuer →' }));
    await waitFor(() => screen.getByRole('heading', { name: /Votre style/i }));
  }

  it('le bouton Continuer est désactivé sans ambiance sélectionnée', async () => {
    await allerEtape2();
    expect(screen.getByRole('button', { name: 'Continuer →' })).toBeDisabled();
  });

  it('affiche l\'étape 3 (photos) après validation du style', async () => {
    await allerEtape2();
    fireEvent.click(screen.getByText('Cosy et enveloppant'));
    fireEvent.click(screen.getByRole('button', { name: 'Continuer →' }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Montrez-moi votre pièce');
    });
  });
});

describe('AnalysePage — étape 3 (photos + email + paiement)', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { search: '', href: '' };
    jest.clearAllMocks();
  });

  async function allerEtape3() {
    render(<AnalysePage />);
    selectionnerStep1();
    fireEvent.click(screen.getByRole('button', { name: 'Continuer →' }));
    await waitFor(() => screen.getByText('Cosy et enveloppant'));
    fireEvent.click(screen.getByText('Cosy et enveloppant'));
    fireEvent.click(screen.getByRole('button', { name: 'Continuer →' }));
    await waitFor(() => screen.getByPlaceholderText('votre@email.fr'));
  }

  it('affiche la zone d\'upload à l\'étape 3', async () => {
    await allerEtape3();
    expect(screen.getByText('Choisir mes photos')).toBeInTheDocument();
  });

  it('affiche le champ email à l\'étape 3', async () => {
    await allerEtape3();
    expect(screen.getByPlaceholderText('votre@email.fr')).toBeInTheDocument();
  });

  it('le bouton payer est désactivé sans photo ni email ni CGV', async () => {
    await allerEtape3();
    expect(screen.getByRole('button', { name: /Payer/i })).toBeDisabled();
  });

  it('affiche le récap de la pièce à l\'étape 3', async () => {
    await allerEtape3();
    expect(screen.getByText(/Chambre/)).toBeInTheDocument();
    expect(screen.getByText(/300–800€/)).toBeInTheDocument();
  });

  it('track "Analysis Photo Added" à l\'ajout de la première photo', async () => {
    const { track } = require('@/lib/plausible');
    await allerEtape3();
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(track).toHaveBeenCalledWith('Analysis Photo Added', { count: 1 });
  });
});
