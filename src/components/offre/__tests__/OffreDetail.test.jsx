import { render, screen } from '@testing-library/react';
import OffreDetail from '../OffreDetail';

jest.mock('@/components/kova/KovaHeading', () => ({ children, level, light }) => {
  const Tag = level || 'h2';
  return <Tag data-light={light ? 'true' : undefined}>{children}</Tag>;
});

describe('OffreDetail', () => {
  it('se rend sans erreur', () => {
    render(<OffreDetail />);
  });

  it('affiche les deux sections par défaut', () => {
    render(<OffreDetail />);
    expect(screen.getByText('Comment ça marche')).toBeInTheDocument();
    expect(screen.getByText('Ce que vous recevez')).toBeInTheDocument();
  });

  it('affiche "votre pièce" quand piece n\'est pas fourni', () => {
    render(<OffreDetail />);
    expect(screen.getByText(/Un diagnostic de votre pièce/)).toBeInTheDocument();
  });

  it('affiche le nom de la pièce quand piece est fourni', () => {
    render(<OffreDetail piece="salon" />);
    expect(screen.getByText(/Un diagnostic de votre salon/)).toBeInTheDocument();
  });

  it('n\'affiche que les étapes avec only="steps"', () => {
    render(<OffreDetail only="steps" />);
    expect(screen.getByText('Comment ça marche')).toBeInTheDocument();
    expect(screen.queryByText('Ce que vous recevez')).not.toBeInTheDocument();
  });

  it('n\'affiche que les livrables avec only="deliverables"', () => {
    render(<OffreDetail only="deliverables" />);
    expect(screen.queryByText('Comment ça marche')).not.toBeInTheDocument();
    expect(screen.getByText('Ce que vous recevez')).toBeInTheDocument();
  });

  it('affiche les 3 étapes numérotées', () => {
    render(<OffreDetail />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('applique la classe dark sur les livrables quand dark=true', () => {
    const { container } = render(<OffreDetail dark />);
    expect(container.querySelector('.offre-detail--dark')).toBeInTheDocument();
  });

  it('applique offre-detail__section--dark-inline avec dark + only="deliverables"', () => {
    const { container } = render(<OffreDetail dark only="deliverables" />);
    expect(container.querySelector('.offre-detail__section--dark-inline')).toBeInTheDocument();
  });

  it('n\'applique pas offre-detail--dark avec only="steps"', () => {
    const { container } = render(<OffreDetail dark only="steps" />);
    expect(container.querySelector('.offre-detail--dark')).not.toBeInTheDocument();
  });
});
