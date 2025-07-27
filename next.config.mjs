/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dazzi-test-editor.s3.ap-northeast-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/admin/:path*',
        destination: `${process.env.BACKEND_API_URL || 'http://localhost:4569'}/api/v1/admin/:path*`,
      },
    ];
  },
};

export default nextConfig;
