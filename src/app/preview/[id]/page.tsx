"use client";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useArticleStore } from "@/store/articleStore";
import "ckeditor5/ckeditor5.css";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/api/axiosInstance";

interface ArticleDetail {
  id: number;
  title: string;
  subtitle: string;
  text: string;
  permalink: string;
  categoryId: number;
  editorId: string;
  editorName: string;
  isPublish: boolean;
  isMainPublish: boolean;
  imageUrl: string;
  updateAt: string;
  createAt: string;
}

const PreviewPage = () => {
  const { data: session } = useSession();
  const { articleData: editorData } = useArticleStore();
  const router = useRouter();
  const params = useParams();
  const permalink = Array.isArray(params.id) ? params.id[0] : params.id;
  const [isMobileView, setIsMobileView] = useState(false);
  const [articleDetail, setArticleDetail] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEditorNames, setUserEditorNames] = useState<string[]>([]);

  // 현재 로그인한 사용자 정보
  const currentUserEmail = session?.user?.email;
  const currentUserName = session?.user?.name;

  // URL 디코딩
  const decodedPermalink = decodeURIComponent(permalink || "");

  // 기사 수정 권한 체크 함수
  const canEditArticle = (): boolean => {
    if (!articleDetail) return false;
    
    // 1. 현재 로그인한 사용자 이름과 일치하거나
    // 2. 현재 사용자가 생성한 에디터 이름과 일치하는지 확인
    return currentUserName === articleDetail.editorName || userEditorNames.includes(articleDetail.editorName);
  };

  // 사용자가 생성한 에디터 이름들 가져오기
  const fetchUserEditors = async () => {
    try {
      const response = await axiosInstance.get("/editor/list");
      const editors = response.data.data || response.data || [];
      const myEditorNames = editors
        .filter((editor: { createdBy: string; editorName: string }) => editor.createdBy === currentUserEmail)
        .map((editor: { createdBy: string; editorName: string }) => editor.editorName);
        
      setUserEditorNames(myEditorNames);
    } catch (error) {
      console.error("에디터 목록 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        const response = await axiosInstance.get(`/article/detail/${permalink}`);
        const articleData = response.data.data;
        
        // 플레이스홀더를 실제 S3 URL로 복원
        if (articleData.imageUrl && articleData.text) {
          let restoredContent = articleData.text;
          
          // 이미지 URL 파싱
          let imageUrlString = articleData.imageUrl;
          if (imageUrlString.startsWith('[') && imageUrlString.endsWith(']')) {
            imageUrlString = imageUrlString.slice(1, -1);
          }
          
          const imageUrls: string[] = imageUrlString.split(',').map((url: string) => 
            url.trim().replace(/"/g, '').replace(/'/g, '')
          ).filter((url: string) => url.length > 0);
          
          // 플레이스홀더를 실제 이미지 URL로 교체 (썸네일은 제외하고 에디터 이미지만)
          if (imageUrls.length > 1) {
            imageUrls.slice(1).forEach((url: string, index: number) => {
              const placeholder = `__IMAGE_PLACEHOLDER_${index + 1}__`;
              restoredContent = restoredContent.replace(placeholder, url);
            });
          }
          
          // 복원된 콘텐츠로 업데이트
          articleData.text = restoredContent;
        }
        
        setArticleDetail(articleData);
      } catch (error) {
        console.error("기사 상세 정보를 가져오는데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    if (permalink) {
      fetchArticleDetail();
      fetchUserEditors();
    }
  }, [permalink, currentUserEmail]);

  const handleEdit = () => {
    router.push(`/articles/edit/${permalink}`);
  };

  const handleBackToList = () => {
    router.push("/articles");
  };

  const toggleViewMode = () => {
    setIsMobileView(!isMobileView);
  };
  if (loading) {
    return (
      <div className="relative pb-20 max-w-5xl mx-auto bg-white p-4">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  // 기사 데이터가 있으면 그것을 사용하고, 없으면 스토어의 editorData 사용
  const contentToShow = articleDetail?.text || editorData;

  return (
    <div className="relative pb-20 max-w-5xl mx-auto bg-white p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {articleDetail?.title || "기사 미리보기"}
          </h1>
          <p className="text-gray-600 mt-1">
            Permalink: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{decodedPermalink}</span>
          </p>
          {articleDetail?.subtitle && (
            <p className="text-gray-700 mt-2">{articleDetail.subtitle}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleBackToList}>
            목록으로
          </Button>
          <Button onClick={toggleViewMode}>
            {!isMobileView ? "📱 모바일" : "💻 PC"}
          </Button>
          {canEditArticle() ? (
            <Button onClick={handleEdit}>
              ✏️ 수정하기
            </Button>
          ) : (
            <span className="text-sm text-gray-400 px-2">
              작성자만 수정 가능
            </span>
          )}
        </div>
      </div>
      
      <div className="border-b-2 border-gray-200 mb-6"></div>

      {!isMobileView ? (
        <div className="flex justify-center">
          <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] overflow-hidden shadow-lg border-8 border-black">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[210px] h-[30px] bg-black rounded-b-[15px]"></div>
            <div className="absolute top-[40px] bottom-[40px] left-0 right-0 bg-white overflow-y-auto p-4">
              <div
                className="ck-content text-sm"
                dangerouslySetInnerHTML={{ __html: contentToShow }}
              />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[130px] h-[5px] bg-gray-400 rounded-full"></div>
          </div>
        </div>
      ) : (
        <div className="max-w-none">
          <div
            className="ck-content"
            dangerouslySetInnerHTML={{ __html: contentToShow }}
          />
        </div>
      )}
    </div>
  );
};

export default PreviewPage;
