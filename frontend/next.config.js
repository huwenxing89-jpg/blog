/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8088/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:8088/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
