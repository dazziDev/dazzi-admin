'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // 어드민 메인 페이지 접속 시 article 페이지로 리디렉션
    router.replace('/article');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>기사 관리 페이지로 이동 중...</p>
      </div>
    </div>
  );
};

export default Home;
