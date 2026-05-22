import { getAllPosts } from '@/lib/blog';

const PIECES = ['salon', 'chambre', 'cuisine', 'entree', 'salle-de-bain', 'bureau'];

export default function sitemap() {
  const posts = getAllPosts();

  const blogEntries = posts.map((post) => ({
    url: `https://www.studiokova.fr/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const pieceEntries = PIECES.map((type) => ({
    url: `https://www.studiokova.fr/piece/${type}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: 'https://www.studiokova.fr',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://www.studiokova.fr/quiz',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.studiokova.fr/analyse',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.studiokova.fr/surmesure',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.studiokova.fr/offre-premium',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.studiokova.fr/je-transforme-ma-piece',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.studiokova.fr/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...pieceEntries,
    ...blogEntries,
    {
      url: 'https://www.studiokova.fr/confidentialite',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://www.studiokova.fr/mentions-legales',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}