"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import axiosInstance from "@/app/api/axiosInstance";
import dynamic from "next/dynamic";

// CKEditor를 동적으로 로드 (SSR 방지)
const CustomArticle = dynamic(() => import("@/components/article/customArticle"), {
  ssr: false,
});

interface ArticleDetail {
  id: number;
  title: string;
  subtitle: string;
  text: string;
  permalink: string;
  categoryId: number;
  editorId: string;
  isPublish: boolean;
  isMainPublish: boolean;
  imageUrl: string;
}

const ArticleEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const permalink = params.id; // URL에서는 id로 받지만 실제로는 permalink
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axiosInstance.get(`/article/detail/${permalink}`);
        setArticle(response.data.data);
      } catch (error) {
        console.error("기사를 가져오는데 실패했습니다:", error);
        setError("기사를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (permalink) {
      fetchArticle();
    }
  }, [permalink]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 mb-4">오류</h2>
          <p className="text-gray-600 mb-4">{error || "기사를 찾을 수 없습니다."}</p>
          <Button onClick={() => router.push("/articles")}>
            기사 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">기사 수정</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/articles")}
        >
          목록으로 돌아가기
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <CustomArticle 
          initialData={article}
          mode="edit"
          articleId={article.id.toString()}
        />
      </div>
    </div>
  );
};

export default ArticleEditPage;