"use client";
import { saveArticleContent } from "@/app/api/article";
import { articleConfig } from "@/config/articleConfig";
import { processArticleContent } from "@/hooks/useArticleImgProcess";
import { useArticleStore } from "@/store/articleStore";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import AvatarSelector from "../editorAvatar/avatarSelector";
import { Button } from "../ui/button";

import { useCategoryStore } from "@/store/categoryStore";
import CategoryInput from "./categoryInput";
import MainPublishToggle from "./mainPublishToggle";
import PermalinkInput from "./permalinkInput";
import PublishToggle from "./publishToggle";
import SubtitleInput from "./subtitleInput";
import TitleInput from "./titleInput";

const CustomArticle = () => {
  const articleRef = useRef<ClassicEditor | null>(null);
  const { articleData, setArticleData, selectedEditor, isSubmitDisabled } =
    useArticleStore();

  const router = useRouter();

  const {
    categoryList,
    setCategoryList,
    addCategory: addCategoryToStore,
  } = useCategoryStore();

  const handleArticleChange = (event: any, article: any) => {
    const data = article.getData();
    setArticleData(data);
  };

  useEffect(() => {
    if (selectedEditor) {
      const profileCardHtml = `
        <div class="raw-html-embed w-full">
          <div class="profile-card" style="display: flex; align-items: center; padding: 10px; border: 1px solid #e0e0e0; border-radius: 12px; margin: 10px 0; background-color: #f9f9f9; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <img src="${selectedEditor.articleImage}" alt="name" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px; border: 2px solid #007bff;">
            <div>
              <strong style="font-size: 1.1rem; color: #333;">${selectedEditor.editorName}</strong>
              <p style="margin: 5px 0 0; font-size: 0.9rem; color: #666;">${selectedEditor.description}</p>
            </div>
          </div>
        </div>
      `;

      setArticleData((prevData) => {
        let newData = prevData;

        const profileCardRegex = /<div class="raw-html-embed">[\s\S]*?<\/div>/g;
        if (profileCardRegex.test(newData)) {
          newData = newData.replace(profileCardRegex, "");
        }
        newData += profileCardHtml;

        return newData;
      });
    }
  }, [selectedEditor, setArticleData]);

  useEffect(() => {
    if (articleRef.current && articleData) {
      if (articleRef.current.getData() !== articleData) {
        articleRef.current.setData(articleData);
      }
    }
  }, [articleData]);

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

      if (!selectedEditor || !selectedCategories[0]) {
        alert("기사 작성자와 카테고리를 선택해주세요.");
        return;
      }
      const selectedPermalink = selectedCategories[0];
      const selectedCategory = categoryList.find(
        (category) => category.permalink === selectedPermalink
      );

      // 1. 에디터 콘텐츠 가져오기
      const content: string = articleData;

      // 2. 콘텐츠에서 이미지 처리
      const { modifiedContent, imageFiles } = await processArticleContent(
        content
      );

      // 3. 데이터 객체 생성
      const data = {
        editorId: selectedEditor.editorId,
        categoryId: selectedCategory?.categoryId,
        // categoryId: 1,
        title: title,
        subtitle: subtitle,
        text: modifiedContent,
        permalink: permalink,
        isPublish: isPublish,
        isMainPublish: isMainPublish,
      };
      // 4. FormData 생성 및 데이터 추가
      const formData = new FormData();
      // TODO: 이미지 사이즈 고정
      // TODO: 카테고리(등록,선택) API 따로 연동
      // TODO: 공개여부 체크박스 추가
      // TODO: 메인공개여부 체크박스 추가
      // TODO: 썸네일 사진같은경우는 이미지 파일 배열에 0번째로 추가
      // TODO: 썸네일 사진 따로 받아야함.

      formData.append(
        "data",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );

      imageFiles.forEach((file) => {
        formData.append("imageFiles", file);
      });
      console.log("formData", formData);

      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      // 5. 백엔드로 데이터 전송
      const response = await saveArticleContent(formData);

      // 통신 성공 후 permalinks로 이동
      // response 없음
      router.push(`/preview/${response.permalink}`);
    } catch (error) {
      console.error("Failed to save content:", error);
      // 에러 처리 로직 추가
      alert("콘텐츠 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="relative pb-16 max-w-5xl mx-auto">
      <AvatarSelector />
      <CategoryInput />
      <TitleInput />
      <SubtitleInput />
      <PermalinkInput />
      <div className="gap-4 flex flex-wrap">
        <PublishToggle />
        <MainPublishToggle />
      </div>
      {/* <PublishTimeInput /> */}
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
        <Button
          className="absolute right-0 bottom-0 m-4"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          확인
        </Button>
      </div>
    </div>
  );
};

export default CustomArticle;
