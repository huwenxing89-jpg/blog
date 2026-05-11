/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // 开发模式下不使用 output: export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // API 代理
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
