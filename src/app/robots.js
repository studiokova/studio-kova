export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/analyse/merci',
        '/offre-premium/confirmation',
        '/premium/',
      ],
    },
    sitemap: 'https://www.studiokova.fr/sitemap.xml',
  };
}
