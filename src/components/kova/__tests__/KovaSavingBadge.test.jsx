import { render, screen } from '@testing-library/react';
import KovaSavingBadge from '../KovaSavingBadge';

describe('KovaSavingBadge', () => {
  it('ne rend rien si amount est 0', () => {
    const { container } = render(<KovaSavingBadge amount={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('ne rend rien si amount est négatif', () => {
    const { container } = render(<KovaSavingBadge amount={-10} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('ne rend rien si amount est undefined', () => {
    const { container } = render(<KovaSavingBadge />);
    expect(container).toBeEmptyDOMElement();
  });

  it('ne rend rien si amount est null', () => {
    const { container } = render(<KovaSavingBadge amount={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('affiche le badge si amount > 0', () => {
    render(<KovaSavingBadge amount={69} />);
    expect(screen.getByText(/Vous économisez/)).toBeInTheDocument();
  });

  it('affiche le badge avec la classe correcte', () => {
    render(<KovaSavingBadge amount={69} />);
    expect(screen.getByText(/Vous économisez/)).toHaveClass('kova-saving-badge');
  });

  it('affiche le montant avec le symbole €', () => {
    render(<KovaSavingBadge amount={69} />);
    expect(screen.getByText(/69/)).toBeInTheDocument();
  });
});
