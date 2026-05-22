/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/blog/decorer-appartement-guide-complet',
        destination: '/blog/decorer-appartement',
        permanent: true,
      },
    ]
  },
  turbopack: {},
  images: {
    remotePatterns: [
      { hostname: 'public.blob.vercel-storage.com' },
      { hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  },
}

export default nextConfig

