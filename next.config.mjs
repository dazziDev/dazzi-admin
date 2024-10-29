/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'dazzi-test-editor.s3.ap-northeast-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/auth/:path*',
  //       destination: '/api/auth/:path*', // 자체 Next.js API 라우트로 전달
  //     },
  //   ];
  // },
};

export default nextConfig;
