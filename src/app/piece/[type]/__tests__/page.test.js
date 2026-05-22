import { render } from '@testing-library/react';
import { piecesData } from '@/data/pieces';
import PiecePage, { generateStaticParams, generateMetadata } from '../page';

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => { throw new Error('NOT_FOUND'); }),
}));

jest.mock('@/components/PieceTemplate', () =>
  function MockPieceTemplate({ data }) {
    return <div data-testid="piece-template">{data.slug}</div>;
  }
);

jest.mock('@/lib/blog', () => ({
  getPostsByPiece: () => [],
  formatDate: (d) => d,
}));

describe('piece/[type]/page', () => {
  it('generateStaticParams retourne un slug pour chaque pièce', async () => {
    const params = await generateStaticParams();
    const expected = Object.keys(piecesData).map((slug) => ({ type: slug }));
    expect(params).toEqual(expected);
  });

  it('generateMetadata retourne les métadonnées pour une pièce valide', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ type: 'chambre' }) });
    expect(meta.title).toBe(piecesData.chambre.meta.title);
    expect(meta.description).toBe(piecesData.chambre.meta.description);
  });

  it('generateMetadata retourne {} pour un type inconnu', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ type: 'inconnue' }) });
    expect(meta).toEqual({});
  });

  it('rend PieceTemplate pour une pièce valide', async () => {
    const element = await PiecePage({ params: Promise.resolve({ type: 'salon' }) });
    const { getByTestId } = render(element);
    expect(getByTestId('piece-template')).toBeInTheDocument();
  });

  it('appelle notFound pour un type inconnu', async () => {
    const { notFound } = require('next/navigation');
    await expect(
      PiecePage({ params: Promise.resolve({ type: 'inconnue' }) })
    ).rejects.toThrow('NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});
