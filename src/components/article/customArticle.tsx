"use client";
import {
  fetchArticleDetail,
  saveArticleContent,
  updateArticleContent,
} from "@/app/api/article";
import { articleConfig } from "@/config/articleConfig";
import { processArticleContent } from "@/hooks/useArticleImgProcess";
import { useArticleStore } from "@/store/articleStore";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AuthorSelector from "../editorAvatar/avatarSelector";
import { Button } from "../ui/button";
import ArticlePreviewModal from "./articlePreviewModal";

import { useCategoryStore } from "@/store/categoryStore";
import { useEditorStore } from "@/store/editorStore";
import ThumbnailUpload from "../imageUpload/thumbnailUpload";
import CategoryInput from "./categoryInput";
import MainPublishToggle from "./mainPublishToggle";
import PermalinkInput from "./permalinkInput";
import PublishTimeInput from "./publishTimeInput";
import PublishToggle from "./publishToggle";
import SubtitleInput from "./subtitleInput";
import TitleInput from "./titleInput";

interface CustomArticleProps {
  initialData?: any;
  mode?: "create" | "edit";
  articleId?: string;
}

const CustomArticle = ({
  initialData,
  mode = "create",
  articleId,
}: CustomArticleProps) => {
  const { data: session } = useSession();
  const articleRef = useRef<ClassicEditor | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const {
    articleData,
    setArticleData,
    selectedEditor,
    isSubmitDisabled,
    thumbnail,
    title,
    subtitle,
    permalink,
    selectedCategories,
    isPublish,
    isMainPublish,
    landscapeThumbnail,
    portraitThumbnail,
    setTitle,
    setSubtitle,
    setPermalink,
    setSelectedCategories,
    setIsPublish,
    setIsMainPublish,
    setSelectedEditor,
    setThumbnail,
    setLandscapeThumbnail,
    setPortraitThumbnail,
  } = useArticleStore();

  const router = useRouter();

  const {
    categoryList,
    setCategoryList,
    addCategory: addCategoryToStore,
  } = useCategoryStore();

  const { editors } = useEditorStore();

  const handleArticleChange = (event: any, article: any) => {
    const data = article.getData();
    setArticleData(data);
  };

  // 프로필 카드 자동 삽입 기능 제거됨 - 시스템에서 자동 생성으로 변경

  // 편집 모드일 때 초기 데이터 로드
  useEffect(() => {
    if (mode === "edit" && initialData) {
      console.log("📝 편집 모드 - 초기 데이터 로드:", initialData);

      setTitle(initialData.title || "");
      setSubtitle(initialData.subtitle || "");
      setPermalink(initialData.permalink || "");
      setIsPublish(initialData.isPublish || false);
      setIsMainPublish(initialData.isMainPublish || false);

      // 기존 이미지 URL 파싱 및 썸네일 설정
      let parsedImageUrls: string[] = [];
      if (initialData.imageUrl) {
        try {
          // "[url1, url2, url3]" 형태의 문자열을 파싱
          let imageUrlString = initialData.imageUrl;

          // 대괄호 제거
          if (imageUrlString.startsWith("[") && imageUrlString.endsWith("]")) {
            imageUrlString = imageUrlString.slice(1, -1);
          }

          // 쉼표로 분리하고 URL 정리
          parsedImageUrls = imageUrlString
            .split(",")
            .map((url: string) =>
              url.trim().replace(/"/g, "").replace(/'/g, "")
            )
            .filter((url: string) => url.length > 0);

          console.log("🖼️ 파싱된 이미지 URLs:", parsedImageUrls);

          // 첫 번째 이미지를 썸네일로 설정
          if (parsedImageUrls.length > 0) {
            setThumbnail(parsedImageUrls[0]);
            console.log("🎨 썸네일 설정:", parsedImageUrls[0]);
          }
        } catch (error) {
          console.error(
            "❌ 이미지 URL 파싱 실패:",
            error,
            initialData.imageUrl
          );
        }
      }

      // 기존 HTML 콘텐츠 설정 - 플레이스홀더를 실제 S3 URL로 복원
      let restoredContent = initialData.text || "";

      // 플레이스홀더를 실제 이미지 URL로 교체 (썸네일은 제외하고 에디터 이미지만)
      if (parsedImageUrls.length > 1) {
        // 첫 번째는 썸네일이므로 두 번째부터 에디터 이미지
        parsedImageUrls.slice(1).forEach((url, index) => {
          const placeholder = `__IMAGE_PLACEHOLDER_${index + 1}__`;
          restoredContent = restoredContent.replace(placeholder, url);
        });
        console.log("🔄 플레이스홀더를 실제 URL로 복원 완료");
      }

      setArticleData(restoredContent);
      console.log("📄 기사 콘텐츠 설정 완료");

      // 카테고리 설정
      if (initialData.categoryId) {
        // categoryId로 해당 카테고리를 찾아서 permalink 사용
        const selectedCategory = categoryList.find(
          (cat) => cat.categoryId === initialData.categoryId
        );
        if (selectedCategory) {
          setSelectedCategories([selectedCategory.permalink]);
          console.log(
            "📂 카테고리 설정:",
            selectedCategory.permalink,
            selectedCategory.categoryName
          );
        }
      }

      // 에디터 설정 (editorId가 있는 경우)
      if (initialData.editorId && editors.length > 0) {
        const selectedEditor = editors.find(
          (editor) => editor.editorId === initialData.editorId
        );
        if (selectedEditor) {
          setSelectedEditor(selectedEditor);
          console.log("👤 에디터 설정:", selectedEditor.editorName);
        }
      }
    }
  }, [mode, initialData, categoryList, editors]);

  useEffect(() => {
    if (articleRef.current && articleData) {
      if (articleRef.current.getData() !== articleData) {
        articleRef.current.setData(articleData);
      }
    }
  }, [articleData]);

  // 썸네일 비율 검증 함수
  const validateThumbnailAspectRatio = (
    thumbnailUrl: string,
    isLandscape: boolean
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const expectedRatio = isLandscape ? 16 / 9 : 3 / 4; // 가로형: 16:9, 세로형: 3:4
        const tolerance = 0.1; // 10% 허용 오차

        const isValidRatio = Math.abs(aspectRatio - expectedRatio) <= tolerance;
        console.log(
          `🖼️ 썸네일 비율 검증: ${img.width}x${
            img.height
          } (${aspectRatio.toFixed(2)}) vs 예상 비율 ${expectedRatio.toFixed(
            2
          )}`
        );
        resolve(isValidRatio);
      };
      img.onerror = () => resolve(false);
      img.src = thumbnailUrl;
    });
  };

  const handleSubmit = async () => {
    try {
      const {
        articleData,
        selectedEditor,
        selectedCategories,
        title,
        subtitle,
        permalink,
        isPublish,
        isMainPublish,
        publishTime,
      } = useArticleStore.getState();

      if (!selectedCategories[0]) {
        alert("카테고리를 선택해주세요.");
        return;
      }

      if (!selectedEditor.editorId) {
        alert("기사 작성자를 선택해주세요.");
      }

      // 듀얼 썸네일 검증
      if (!landscapeThumbnail) {
        alert("가로형 썸네일을 추가해주세요.");
        return;
      }

      if (!portraitThumbnail) {
        alert("세로형 썸네일을 추가해주세요.");
        return;
      }

      // 듀얼 썸네일 비율 검증
      const isValidLandscape = await validateThumbnailAspectRatio(
        landscapeThumbnail,
        true
      ); // 가로형은 16:9
      const isValidPortrait = await validateThumbnailAspectRatio(
        portraitThumbnail,
        false
      ); // 세로형은 3:4

      if (!isValidLandscape) {
        alert(
          "가로형 썸네일 비율이 올바르지 않습니다.\n16:9 비율로 다시 자르기해주세요."
        );
        return;
      }

      if (!isValidPortrait) {
        alert(
          "세로형 썸네일 비율이 올바르지 않습니다.\n3:4 비율로 다시 자르기해주세요."
        );
        return;
      }

      const selectedPermalink = selectedCategories[0];
      const selectedCategory = categoryList.find(
        (category) => category.permalink === selectedPermalink
      );

      if (!selectedCategory) {
        alert("카테고리를 선택해주세요.");
        return;
      }

      // 1. 에디터 콘텐츠 가져오기
      const content: string = articleData;

      // 2. 콘텐츠에서 이미지 처리 - 듀얼 썸네일 사용
      // 가로형, 세로형 썸네일 순서로 배열 전달
      const thumbnails = [landscapeThumbnail, portraitThumbnail];
      const { modifiedContent, imageFiles } = await processArticleContent(
        content,
        thumbnails, // 듀얼 썸네일 배열 전달
        mode === "edit" // 수정 모드인지 전달
      );

      // 3. FormData 생성 및 데이터 추가
      const formData = new FormData();
      const currentEditorName =
        session?.user?.name || selectedEditor.editorName;
      console.log("📝 FormData에 설정할 editorName:", {
        sessionUserName: session?.user?.name,
        selectedEditorName: selectedEditor.editorName,
        finalEditorName: currentEditorName,
      });

      formData.append("editorId", selectedEditor.editorId);
      formData.append("editorName", currentEditorName);
      formData.append("categoryId", selectedCategory.categoryId.toString());
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("text", modifiedContent);
      formData.append("permalink", permalink);
      formData.append("isPublish", isPublish.toString());
      formData.append("isMainPublish", isMainPublish.toString());
      console.log("publishTime 값:", publishTime);
      if (publishTime && publishTime.trim() !== "") {
        formData.append("publishTime", publishTime);
        console.log("publishTime을 formData에 추가:", publishTime);
      } else {
        console.log("publishTime이 비어있어서 formData에 추가하지 않음");
      }

      imageFiles.forEach((file, index) => {
        formData.append("files", file);
        // 디버그용
        console.log(`Image File ${index}:`, file.name);
      });

      // FormData를 JSON 형태로 출력하기 확인용
      const formDataEntries: { [key: string]: any } = {};
      formData.forEach((value, key) => {
        formDataEntries[key] = value;
      });
      console.log(
        "FormData contents:",
        JSON.stringify(formDataEntries, null, 2)
      );

      // 5. 백엔드로 데이터 전송
      let response;
      if (mode === "edit" && articleId) {
        // 편집 모드: 새로운 이미지만 전송 (썸네일이 S3 URL인 경우 제외)
        const isExistingThumbnail =
          thumbnail &&
          (thumbnail.includes("amazonaws.com") || thumbnail.includes("s3"));

        // 새로운 FormData 생성 (기존 이미지 제외)
        const editFormData = new FormData();
        editFormData.append("editorId", selectedEditor.editorId);
        editFormData.append(
          "editorName",
          session?.user?.name || selectedEditor.editorName
        );
        editFormData.append(
          "categoryId",
          selectedCategory.categoryId.toString()
        );
        editFormData.append("title", title);
        editFormData.append("subtitle", subtitle);
        editFormData.append("text", modifiedContent);
        editFormData.append("permalink", permalink);
        editFormData.append("isPublish", isPublish.toString());
        editFormData.append("isMainPublish", isMainPublish.toString());
        if (publishTime && publishTime.trim() !== "") {
          editFormData.append("publishTime", publishTime);
        }

        // 듀얼 썸네일 처리
        const isExistingLandscape =
          landscapeThumbnail &&
          (landscapeThumbnail.includes("amazonaws.com") ||
            landscapeThumbnail.includes("s3"));
        const isExistingPortrait =
          portraitThumbnail &&
          (portraitThumbnail.includes("amazonaws.com") ||
            portraitThumbnail.includes("s3"));

        // 새로운 이미지만 추가
        if (imageFiles.length > 0) {
          // 기존 이미지가 아닌 경우만 추가
          let startIndex = 0;
          if (isExistingLandscape) startIndex++; // 가로형이 기존 이미지면 1개 건너뜨
          if (isExistingPortrait) startIndex++; // 세로형도 기존 이미지면 1개 더 건너뜨

          imageFiles.slice(startIndex).forEach((file) => {
            editFormData.append("files", file);
          });
        }

        console.log("📤 편집 모드로 데이터 전송:", {
          articleId,
          hasNewImages: editFormData.getAll("files").length,
          contentLength: modifiedContent.length,
          isExistingLandscape,
          isExistingPortrait,
        });

        response = await updateArticleContent(articleId, editFormData);
        if (response) {
          alert("기사가 성공적으로 수정되었습니다.");
          router.push(`/articles`); // 기사 목록으로 이동
        } else {
          alert("기사 수정에 실패했습니다. 다시 시도해주세요.");
        }
      } else {
        // 생성 모드
        console.log("📤 생성 모드로 데이터 전송");
        response = await saveArticleContent(formData);
        if (response) {
          const detailResponse = await fetchArticleDetail(response);
          console.log("detailResponse", detailResponse);
          router.push(`/preview/${response}`);
        } else {
          alert("콘텐츠 저장에 실패했습니다. 다시 시도해주세요.");
        }
      }
    } catch (error: any) {
      console.error("Failed to save content:", error);
      // 에러 메시지 표시
      if (error.message) {
        alert(error.message);
      } else {
        alert("콘텐츠 저장에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="relative pb-16 max-w-5xl mx-auto mb-16">
      <AuthorSelector />
      <CategoryInput />
      <TitleInput />
      <SubtitleInput />
      <PermalinkInput mode={mode} />
      <div className="gap-4 flex flex-wrap">
        <PublishToggle />
        <MainPublishToggle />
      </div>
      <ThumbnailUpload />
      <PublishTimeInput />
      <div className="main-container">
        <div className="editor-container pb-1 editor-container_classic-editor editor-container_include-style editor-container_include-block-toolbar">
          <div className="editor-container__editor">
            <CKEditor
              editor={ClassicEditor}
              config={articleConfig}
              data={articleData}
              onChange={handleArticleChange}
            />
          </div>
        </div>
        <div className="absolute right-0 bottom-0 m-4 flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
            disabled={!title && !articleData}
            title={
              !title && !articleData
                ? "제목이나 내용을 입력한 후 미리보기를 확인하세요"
                : ""
            }
          >
            👁️ 미리보기
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
            {mode === "edit" ? "기사 수정" : "기사 등록"}
          </Button>
        </div>
      </div>

      {/* 미리보기 모달 */}
      <ArticlePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};

export default CustomArticle;
