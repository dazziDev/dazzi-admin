"use client";
import { fetchArticleDetail, saveArticleContent } from "@/app/api/article";
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
import ThumbnailUpload from "../imageUpload/thumbnailUpload";
import CategoryInput from "./categoryInput";
import MainPublishToggle from "./mainPublishToggle";
import PermalinkInput from "./permalinkInput";
import PublishTimeInput from "./publishTimeInput";
import PublishToggle from "./publishToggle";
import SubtitleInput from "./subtitleInput";
import TitleInput from "./titleInput";

const CustomArticle = () => {
  const articleRef = useRef<ClassicEditor | null>(null);
  const {
    articleData,
    setArticleData,
    selectedEditor,
    isSubmitDisabled,
    thumbnail,
  } = useArticleStore();

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
    if (selectedEditor && selectedEditor.editorId) {
      const profileCardHtml = `
        <div class="raw-html-embed">
          <div class="flex justify-center">
            <div class="profile-card flex" style="width:80%; display:flex; align-items: center; padding: 10px; border: 1px solid #e0e0e0; border-radius: 12px; margin-top: 32px; background-color: #f9f9f9; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <img src="${selectedEditor.articleImage}" alt="name" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px; border: 2px solid #007bff;">
              <div>
                <strong style="font-size: 1.1rem; color: #333;">${selectedEditor.editorName}</strong>
                <p style="margin: 5px 0 0; font-size: 0.9rem; color: #666;">${selectedEditor.description}</p>
              </div>
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
        // publishTime,
      } = useArticleStore.getState();

      if (!selectedCategories[0]) {
        alert("카테고리를 선택해주세요.");
        return;
      }

      if (!selectedEditor.editorId) {
        alert("기사 작성자를 선택해주세요.");
      }

      if (!thumbnail) {
        alert("썸네일을 추가해주세요.");
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

      // 2. 콘텐츠에서 이미지 처리
      // 썸네일 이미지를 맨 앞에 추가
      const { modifiedContent, imageFiles } = await processArticleContent(
        content,
        thumbnail
      );

      // 3. FormData 생성 및 데이터 추가
      const formData = new FormData();
      formData.append("editorId", selectedEditor.editorId);
      formData.append("categoryId", selectedCategory.categoryId.toString());
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("text", modifiedContent);
      formData.append("permalink", permalink);
      formData.append("isPublish", isPublish.toString());
      formData.append("isMainPublish", isMainPublish.toString());

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
      const response = await saveArticleContent(formData);
      if (response) {
        const detailResponse = await fetchArticleDetail(response);
        console.log("detailResponse", detailResponse);
        router.push(`/preview/${response}`);
      } else {
        alert("콘텐츠 저장에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Failed to save content:", error);
      // 에러 처리 로직 추가
      alert("콘텐츠 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="relative pb-16 max-w-5xl mx-auto mb-16">
      <AvatarSelector />
      <CategoryInput />
      <TitleInput />
      <SubtitleInput />
      <PermalinkInput />
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
        <Button
          className="absolute right-0 bottom-0 m-4"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          기사등록
        </Button>
      </div>
    </div>
  );
};

export default CustomArticle;
