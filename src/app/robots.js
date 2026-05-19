export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/analyse/merci',
        '/premium/brief',
        '/premium/merci',
        '/offre-premium/',
      ],
    },
    sitemap: 'https://www.studiokova.fr/sitemap.xml',
  };
}
