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
  async rewrites() {
    return [
      // 로그인 관련 요청 예외 설정
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*', // 자체 Next.js API 라우트로 전달
      },
      // 그 외의 모든 API 요청은 백엔드로 프록시
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`, // 환경 변수를 이용한 프록시
      },
    ];
  },
};

export default nextConfig;
