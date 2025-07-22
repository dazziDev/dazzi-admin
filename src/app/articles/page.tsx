"use client";

import axiosInstance from "@/app/api/axiosInstance";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Article {
  title: string;
  subtitle: string;
  permalink: string;
  categoryId: number;
  editorId: string;
  editorName: string;
  isPublish: boolean;
  isMainPublish: boolean;
  updateAt: string;
  imageUrl: string;
  categoryName?: string;
  uniqueKey?: string;
}

interface CategoryForArticle {
  categoryId: number;
  categoryName: string;
  article: Article[];
}

const ArticlesManagePage = () => {
  const { data: session } = useSession();
  const [articlesByCategory, setArticlesByCategory] = useState<
    CategoryForArticle[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [userEditorNames, setUserEditorNames] = useState<string[]>([]);

  // 현재 로그인한 사용자 정보
  const currentUserEmail = session?.user?.email;
  const currentUserName = session?.user?.name;

  // 기사 수정/삭제 권한 체크 함수
  const canEditOrDelete = (article: Article): boolean => {
    console.log("🔍 권한 체크:", {
      currentUserEmail,
      currentUserName,
      articleEditorName: article.editorName,
      userEditorNames,
      isMatchByName: currentUserName === article.editorName,
      isMatchByEditor: userEditorNames.includes(article.editorName),
    });
    
    // 1. 현재 로그인한 사용자 이름과 일치하거나
    // 2. 현재 사용자가 생성한 에디터 이름과 일치하는지 확인
    return currentUserName === article.editorName || userEditorNames.includes(article.editorName);
  };

  const fetchArticles = async () => {
    try {
      const response = await axiosInstance.get("/article/list");
      console.log("📋 기사 목록 API 응답:", response.data.data);
      if (response.data.data?.[0]?.article?.[0]) {
        console.log(
          "📰 첫 번째 기사 데이터:",
          response.data.data[0].article[0]
        );
      }
      setArticlesByCategory(response.data.data || []);
      
      // 에디터 데이터도 확인
      fetchEditorData();
    } catch (error) {
      console.error("기사 목록을 가져오는데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEditorData = async () => {
    try {
      const response = await axiosInstance.get("/editor/list");
      console.log("👤 에디터 목록:", response.data);
      
      // 현재 사용자가 생성한 에디터들의 이름 추출
      const editors = response.data.data || response.data || [];
      const myEditorNames = editors
        .filter((editor: any) => editor.createdBy === currentUserEmail)
        .map((editor: any) => editor.editorName);
        
      console.log("👤 내가 생성한 에디터 이름들:", myEditorNames);
      setUserEditorNames(myEditorNames);
    } catch (error) {
      console.error("에디터 목록 가져오기 실패:", error);
    }
  };

  const handleDelete = async (permalink: string) => {
    if (confirm("정말로 이 기사를 삭제하시겠습니까?")) {
      try {
        // 먼저 기사 상세 정보를 가져와서 ID를 얻음
        const detailResponse = await axiosInstance.get(
          `/article/detail/${permalink}`
        );
        const articleId = detailResponse.data.data.id;

        await axiosInstance.delete(`/article/delete/${articleId}`);
        alert("기사가 삭제되었습니다.");
        fetchArticles(); // 목록 새로고침
      } catch (error) {
        console.error("기사 삭제에 실패했습니다:", error);
        alert("기사 삭제에 실패했습니다.");
      }
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const formatDate = (dateString: string) => {
    // 서버에서 보내는 시간이 이미 한국 시간인데 UTC 포맷으로 와서 9시간이 더해지는 문제 해결
    console.log("🕐 받은 시간 데이터:", dateString);

    // UTC 포맷에서 시간대 부분을 제거하고 로컬 시간으로 파싱
    let correctedDateString = dateString;
    if (dateString.includes("+00:00")) {
      // +00:00을 제거하여 로컬 시간으로 처리
      correctedDateString = dateString.replace("+00:00", "");
    }

    const date = new Date(correctedDateString);
    console.log("📅 보정된 Date 객체:", date);
    console.log("🌍 현재 브라우저 시간:", new Date());

    const formatted = date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    console.log("⏰ 최종 포맷된 시간:", formatted);
    return formatted;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const allArticles = articlesByCategory
    .flatMap((category) =>
      category.article.map((article) => ({
        ...article,
        categoryName: category.categoryName,
        uniqueKey: `${category.categoryId}-${article.permalink}`, // permalink로 고유 키 생성
      }))
    )
    .sort(
      (a, b) => new Date(b.updateAt).getTime() - new Date(a.updateAt).getTime()
    );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">기사 관리</h1>
        <Link href="/article">
          <Button className="flex items-center gap-2">
            <Plus size={16} />새 기사 작성
          </Button>
        </Link>
      </div>

      {allArticles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">등록된 기사가 없습니다.</p>
          <Link href="/article">
            <Button>첫 번째 기사 작성하기</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    최종 수정일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allArticles.map((article) => (
                  <tr key={article.uniqueKey} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {article.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {article.subtitle}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {article.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {article.editorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            article.isPublish
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {article.isPublish ? "공개" : "비공개"}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            article.isMainPublish
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          {article.isMainPublish
                            ? "🏠 메인 등록"
                            : "📄 일반 기사"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(article.updateAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link href={`/preview/${article.permalink}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Eye size={14} />
                            미리보기
                          </Button>
                        </Link>
                        {canEditOrDelete(article) ? (
                          <>
                            <Link href={`/articles/edit/${article.permalink}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <Edit size={14} />
                                수정
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(article.permalink)}
                            >
                              <Trash2 size={14} />
                              삭제
                            </Button>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400 px-2">
                            작성자만 수정/삭제 가능
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesManagePage;
