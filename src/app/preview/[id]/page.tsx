"use client";
import axiosInstance from "@/app/api/axiosInstance";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useArticleStore } from "@/store/articleStore";
import "ckeditor5/ckeditor5.css";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  landscapeImageUrl?: string;
  portraitImageUrl?: string;
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
  const [articleDetail, setArticleDetail] = useState<ArticleDetail | null>(
    null
  );
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
    return (
      currentUserName === articleDetail.editorName ||
      userEditorNames.includes(articleDetail.editorName)
    );
  };

  // 사용자가 생성한 에디터 이름들 가져오기
  const fetchUserEditors = async () => {
    try {
      const response = await axiosInstance.get("/editor/list");
      const editors = response.data.data || response.data || [];
      const myEditorNames = editors
        .filter(
          (editor: { createdBy: string; editorName: string }) =>
            editor.createdBy === currentUserEmail
        )
        .map(
          (editor: { createdBy: string; editorName: string }) =>
            editor.editorName
        );

      setUserEditorNames(myEditorNames);
    } catch (error) {
      console.error("에디터 목록 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        const response = await axiosInstance.get(
          `/article/detail/${permalink}`
        );
        const articleData = response.data.data;

        // 플레이스홀더를 실제 S3 URL로 복원
        if (articleData.imageUrl && articleData.text) {
          let restoredContent = articleData.text;

          // 이미지 URL 파싱
          let imageUrlString = articleData.imageUrl;
          if (imageUrlString.startsWith("[") && imageUrlString.endsWith("]")) {
            imageUrlString = imageUrlString.slice(1, -1);
          }

          const imageUrls: string[] = imageUrlString
            .split(",")
            .map((url: string) =>
              url.trim().replace(/"/g, "").replace(/'/g, "")
            )
            .filter((url: string) => url.length > 0);

          // 플레이스홀더를 실제 이미지 URL로 교체
          if (imageUrls.length > 0) {
            // 듀얼 썸네일 시스템 확인 (3개 이상의 URL이 있고, 첫 두 개가 썸네일인 경우)
            let startIndex = 0;
            
            // landscapeImageUrl과 portraitImageUrl이 있는지 확인
            const hasLandscapeThumbnail = articleData.landscapeImageUrl && articleData.landscapeImageUrl.trim() !== '';
            const hasPortraitThumbnail = articleData.portraitImageUrl && articleData.portraitImageUrl.trim() !== '';
            
            if (hasLandscapeThumbnail && hasPortraitThumbnail) {
              // 듀얼 썸네일이 있는 경우: 첫 2개는 썸네일
              startIndex = 2;
            } else if (hasLandscapeThumbnail || hasPortraitThumbnail || articleData.imageUrl) {
              // 단일 썸네일만 있는 경우
              startIndex = 1;
            }
            
            // 에디터 내 이미지들 처리
            imageUrls.slice(startIndex).forEach((url: string, index: number) => {
              const placeholder = `__IMAGE_PLACEHOLDER_${index + 1}__`;
              restoredContent = restoredContent.replace(new RegExp(placeholder, 'g'), url);
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
            Permalink:{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {decodedPermalink}
            </span>
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
            <Button onClick={handleEdit}>✏️ 수정하기</Button>
          ) : (
            <span className="text-sm text-gray-400 px-2">
              작성자만 수정 가능
            </span>
          )}
        </div>
      </div>

      <div className="border-b-2 border-gray-200 mb-6"></div>

      {/* 썸네일 표시 */}
      {articleDetail && (articleDetail.landscapeImageUrl || articleDetail.portraitImageUrl || articleDetail.imageUrl) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">썸네일 미리보기</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* 가로형 썸네일 */}
            <div>
              <p className="text-sm text-gray-600 mb-2">🖼️ 가로형 (PC용)</p>
              {articleDetail.landscapeImageUrl ? (
                <img 
                  src={articleDetail.landscapeImageUrl} 
                  alt="가로형 썸네일" 
                  className="w-full rounded-lg border"
                  style={{ aspectRatio: '16/9', objectFit: 'cover' }}
                />
              ) : (
                <div className="w-full bg-gray-200 rounded-lg flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                  <span className="text-gray-400">썸네일 없음</span>
                </div>
              )}
            </div>
            
            {/* 세로형 썸네일 */}
            <div>
              <p className="text-sm text-gray-600 mb-2">📱 세로형 (모바일용)</p>
              {articleDetail.portraitImageUrl ? (
                <img 
                  src={articleDetail.portraitImageUrl} 
                  alt="세로형 썸네일" 
                  className="w-full rounded-lg border"
                  style={{ aspectRatio: '3/4', objectFit: 'cover', maxHeight: '300px' }}
                />
              ) : (
                <div className="w-full bg-gray-200 rounded-lg flex items-center justify-center" style={{ aspectRatio: '3/4', maxHeight: '300px' }}>
                  <span className="text-gray-400">썸네일 없음</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!isMobileView ? (
        <div className="flex justify-center">
          <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] overflow-hidden shadow-lg border-8 border-black">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[210px] h-[30px] bg-black rounded-b-[15px]"></div>
            <div className="absolute top-[40px] bottom-[40px] left-0 right-0 bg-white overflow-y-auto">
              <div className="p-3">
                <div
                  className="ck-content text-sm max-w-full overflow-hidden mobile-frame"
                  dangerouslySetInnerHTML={{ __html: contentToShow }}
                />
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[130px] h-[5px] bg-gray-400 rounded-full"></div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4">
          <div
            className="ck-content max-w-none w-full overflow-hidden pc-view"
            dangerouslySetInnerHTML={{ __html: contentToShow }}
          />
        </div>
      )}
    </div>
  );
};

export default PreviewPage;
