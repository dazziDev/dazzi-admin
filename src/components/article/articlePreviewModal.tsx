"use client";

import { Button } from "@/components/ui/button";
import { useArticleStore } from "@/store/articleStore";
import "ckeditor5/ckeditor5.css";
import { X } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

interface ArticlePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 메모이제이션된 콘텐츠 렌더러 (무한 리렌더링 방지)
const ArticleContentRenderer = memo(
  ({ content }: { content: string }) => {
    console.log("📄 ArticleContentRenderer 렌더링 - 한 번만 실행됨");
    return (
      <div
        className="ck-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  },
  (prevProps, nextProps) => {
    // content가 실제로 변경되지 않는 한 리렌더링하지 않음
    return prevProps.content === nextProps.content;
  }
);

ArticleContentRenderer.displayName = "ArticleContentRenderer";

const ArticlePreviewModal = ({ isOpen, onClose }: ArticlePreviewModalProps) => {
  const { articleData, title, subtitle, selectedEditor, thumbnail } =
    useArticleStore();

  const [isMobileView, setIsMobileView] = useState(false);
  const contentRef = useRef<string>("");
  const hasFixedRef = useRef<boolean>(false);

  // 모달이 열릴 때 콘텐츠를 ref에 고정 (리렌더링 완전 차단)
  if (isOpen && articleData && !hasFixedRef.current) {
    contentRef.current = articleData;
    hasFixedRef.current = true;
    console.log("🔒 미리보기 콘텐츠 ref에 고정 - 리렌더링 차단");
  } else if (!isOpen && hasFixedRef.current) {
    // 모달이 닫히면 ref 초기화
    contentRef.current = "";
    hasFixedRef.current = false;
    console.log("🔓 미리보기 콘텐츠 ref 초기화");
  }

  // 실제 렌더링용 콘텐츠
  const displayContent = contentRef.current;

  // 모달 열림/닫힘 시 body 스크롤 제어
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 body 스크롤 비활성화
      document.body.style.overflow = "hidden";
    } else {
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = "unset";
    }

    // 클린업: 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleViewMode = () => {
    setIsMobileView(!isMobileView);
  };

  // 배경 클릭 시 모달 닫기
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Base64 이미지는 그대로 표시하고, 외부 URL 이미지도 표시
  // CKEditor의 Base64 이미지들이 그대로 미리보기에 표시됨

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex-1">
            <h2 className="text-xl font-bold">{title || "제목 없음"}</h2>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button variant="outline" onClick={toggleViewMode}>
              {!isMobileView ? "📱 모바일" : "💻 PC"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X size={16} className="mr-1" />
              닫기
            </Button>
          </div>
        </div>

        {/* 미리보기 내용 */}
        <div
          className="p-4 overflow-y-auto overflow-x-hidden relative"
          style={{ height: "calc(90vh - 80px)" }}
        >
          {!displayContent ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <p className="text-lg">작성된 내용이 없습니다</p>
                <p className="text-sm mt-2">
                  기사 내용을 작성한 후 미리보기를 확인해보세요
                </p>
              </div>
            </div>
          ) : !isMobileView ? (
            /* 모바일 뷰 (iPhone 14 Pro 스타일) */
            <div className="flex justify-center">
              <div className="relative w-[320px] h-[650px] bg-black rounded-[50px] overflow-hidden shadow-2xl p-[3px]">
                {/* 아이폰 베젤 */}
                <div className="relative w-full h-full bg-black rounded-[47px] overflow-hidden">
                  {/* Dynamic Island */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[95px] h-[30px] bg-black rounded-full z-10"></div>
                  {/* 스크린 */}
                  <div className="absolute inset-[3px] bg-white rounded-[44px] overflow-hidden">
                    {/* 스크린 내부 콘텐츠 영역 */}
                    <div
                      className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-hide pt-8"
                      style={{ WebkitOverflowScrolling: "touch", paddingTop: "40px" }}
                    >
                      {/* 썸네일 이미지 */}
                      {thumbnail && (
                        <div className="w-full h-48 bg-gray-200 overflow-hidden">
                          <img
                            src={thumbnail}
                            alt="썸네일"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* 제목과 부제목 */}
                      <div className="p-4">
                        <h1 className="text-lg font-bold mb-2">
                          {title || "제목 없음"}
                        </h1>
                        {subtitle && (
                          <p className="text-sm text-gray-600 mb-4">
                            {subtitle}
                          </p>
                        )}

                        {/* 기사 내용 */}
                        <div className="text-sm leading-relaxed">
                          <ArticleContentRenderer content={displayContent} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* PC 뷰 */
            <div className="max-w-4xl mx-auto">
              {/* 썸네일 이미지 */}
              {thumbnail && (
                <div className="w-full h-64 bg-gray-200 overflow-hidden rounded-lg mb-6">
                  <img
                    src={thumbnail}
                    alt="썸네일"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* 제목과 부제목 */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-3">
                  {title || "제목 없음"}
                </h1>
                {subtitle && (
                  <p className="text-xl text-gray-600">{subtitle}</p>
                )}
              </div>

              {/* 기사 내용 */}
              <div className="prose max-w-none">
                <ArticleContentRenderer content={displayContent} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlePreviewModal;
