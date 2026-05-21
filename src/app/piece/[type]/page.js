import { notFound } from 'next/navigation';
import PieceTemplate from '@/components/PieceTemplate';
import { piecesData } from '@/data/pieces';
import { getPostsByPiece, formatDate } from '@/lib/blog';

export async function generateStaticParams() {
  return Object.keys(piecesData).map((slug) => ({ type: slug }));
}

export async function generateMetadata({ params }) {
  const { type } = await params;
  const data = piecesData[type];
  if (!data) return {};
  return {
    title: data.meta.title,
    description: data.meta.description,
    alternates: {
      canonical: `https://www.studiokova.fr/piece/${type}`,
    },
    openGraph: {
      title: data.meta.title,
      description: data.meta.description,
      images: [data.meta.ogImage],
      url: `https://www.studiokova.fr/piece/${type}`,
      type: 'website',
    },
  };
}

export default async function PiecePage({ params }) {
  const { type } = await params;
  const data = piecesData[type];
  if (!data) notFound();
  const relatedPosts = getPostsByPiece(type).map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || '',
    date: formatDate(post.date),
    image: post.image || '',
  }));
  return <PieceTemplate data={data} relatedPosts={relatedPosts} />;
}
