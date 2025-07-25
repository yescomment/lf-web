/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.ctfassets.net'],
  },
  async rewrites() {
    return [
      // Preserve Jekyll-style URLs
      {
        source: '/post/:slug',
        destination: '/posts/:slug',
      },
      {
        source: '/people/:slug',
        destination: '/people/:slug',
      },
      {
        source: '/publications/:slug',
        destination: '/publications/:slug',
      },
      {
        source: '/events/:slug',
        destination: '/events/:slug',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/revalidate',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
      {
        source: '/api/revalidate-all',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;