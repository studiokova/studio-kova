import { render } from '@testing-library/react';
import KovaDivider from '../KovaDivider';

describe('KovaDivider', () => {
  it('se rend avec la classe kova-divider', () => {
    const { container } = render(<KovaDivider />);
    expect(container.querySelector('.kova-divider')).toBeInTheDocument();
  });

  it('applique le spacing par défaut (36px)', () => {
    const { container } = render(<KovaDivider />);
    expect(container.querySelector('.kova-divider').style.marginTop).toBe('36px');
    expect(container.querySelector('.kova-divider').style.marginBottom).toBe('36px');
  });

  it('applique un spacing personnalisé', () => {
    const { container } = render(<KovaDivider spacing={24} />);
    expect(container.querySelector('.kova-divider').style.marginTop).toBe('24px');
    expect(container.querySelector('.kova-divider').style.marginBottom).toBe('24px');
  });
});
