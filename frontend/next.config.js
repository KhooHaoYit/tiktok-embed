/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => [
    {
      source: '/v/:id/oembed',
      destination: '/api/oembed',
    },
  ],
}

module.exports = nextConfig
