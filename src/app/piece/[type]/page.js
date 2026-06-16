import { notFound } from 'next/navigation';
import PieceTemplate from '@/components/PieceTemplate';
import { piecesData } from '@/data/pieces';
import { getPostsByPiece, formatDate } from '@/lib/blog';

function buildPieceFaqSchema(faq) {
  if (!Array.isArray(faq) || faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

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
  const faqSchema = buildPieceFaqSchema(data.faq);
  return (
    <>
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <PieceTemplate data={data} relatedPosts={relatedPosts} />
    </>
  );
}
