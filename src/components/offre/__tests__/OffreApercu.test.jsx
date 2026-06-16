import { render, screen } from '@testing-library/react';
import OffreApercu from '../OffreApercu';

jest.mock('next/image', () => function MockImage({ alt, ...props }) {
  return <img alt={alt} {...props} />;
});

describe('OffreApercu', () => {
  it('se rend sans erreur', () => {
    render(<OffreApercu />);
  });

  it('affiche le label "EXEMPLE"', () => {
    render(<OffreApercu />);
    expect(screen.getByText('EXEMPLE')).toBeInTheDocument();
  });

  it('affiche la description de l\'exemple', () => {
    render(<OffreApercu />);
    expect(screen.getByText(/Voici un exemple d/)).toBeInTheDocument();
  });

  it('affiche l\'image d\'aperçu PDF avec le bon alt', () => {
    render(<OffreApercu />);
    expect(screen.getByAltText(/Exemple de livrable PDF Studio Kova/)).toBeInTheDocument();
  });

  it('l\'image a les dimensions correctes', () => {
    render(<OffreApercu />);
    const img = screen.getByAltText(/Exemple de livrable PDF Studio Kova/);
    expect(img).toHaveAttribute('width', '2968');
    expect(img).toHaveAttribute('height', '1400');
  });
});
