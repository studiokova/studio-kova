import { render, screen } from '@testing-library/react';
import CheckList from '../CheckList';

const ITEMS = ['Item A', 'Item B', 'Item C'];

describe('CheckList', () => {
  it('se rend sans erreur', () => {
    render(<CheckList items={ITEMS} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('affiche tous les items', () => {
    render(<CheckList items={ITEMS} />);
    ITEMS.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('affiche autant de listitem que d\'items', () => {
    render(<CheckList items={ITEMS} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(ITEMS.length);
  });

  it('affiche le symbole ✓ pour chaque item', () => {
    render(<CheckList items={ITEMS} />);
    const checks = screen.getAllByText('✓');
    expect(checks).toHaveLength(ITEMS.length);
  });

  it('applique la classe de base kova-checklist', () => {
    render(<CheckList items={ITEMS} />);
    expect(screen.getByRole('list')).toHaveClass('kova-checklist');
  });

  it('applique la classe light', () => {
    render(<CheckList items={ITEMS} light />);
    expect(screen.getByRole('list')).toHaveClass('kova-checklist--light');
  });

  it('applique la classe bordered', () => {
    render(<CheckList items={ITEMS} bordered />);
    expect(screen.getByRole('list')).toHaveClass('kova-checklist--bordered');
  });

  it('peut combiner light et bordered', () => {
    render(<CheckList items={ITEMS} light bordered />);
    const list = screen.getByRole('list');
    expect(list).toHaveClass('kova-checklist--light');
    expect(list).toHaveClass('kova-checklist--bordered');
  });

  it('fonctionne avec une liste vide', () => {
    render(<CheckList />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
