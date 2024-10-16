"use client";
import { saveEditorContent } from "@/app/api/ediotr";
import { editorConfig } from "@/config/editorConfig";
import { processEditorContent } from "@/hooks/useEditorImgProcess";
import { useEditorStore } from "@/store/editorStore";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import AvatarSelector from "../adminAvatar/avatarSelector";
import { Button } from "../ui/button";

import { useCategoryStore } from "@/store/categoryStore";
import CategoryInput from "./categoryInput";
import PermalinkInput from "./permalinkInput";
import SubtitleInput from "./subtitleInput";
import TitleInput from "./titleInput";

const CustomEditor = () => {
  const editorRef = useRef<ClassicEditor | null>(null);
  const { editorData, setEditorData, selectedAuthor, isSubmitDisabled } =
    useEditorStore();

  const router = useRouter();

  const {
    categoryList,
    setCategoryList,
    addCategory: addCategoryToStore,
  } = useCategoryStore();

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
  };

  useEffect(() => {
    if (selectedAuthor) {
      const profileCardHtml = `
        <div class="raw-html-embed w-full">
          <div class="profile-card" style="display: flex; align-items: center; padding: 10px; border: 1px solid #e0e0e0; border-radius: 12px; margin: 10px 0; background-color: #f9f9f9; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <img src="${selectedAuthor.src}" alt="name" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px; border: 2px solid #007bff;">
            <div>
              <strong style="font-size: 1.1rem; color: #333;">${selectedAuthor.name}</strong>
              <p style="margin: 5px 0 0; font-size: 0.9rem; color: #666;">${selectedAuthor.introduction}</p>
            </div>
          </div>
        </div>
      `;

      setEditorData((prevData) => {
        let newData = prevData;

        const profileCardRegex = /<div class="raw-html-embed">[\s\S]*?<\/div>/g;
        if (profileCardRegex.test(newData)) {
          newData = newData.replace(profileCardRegex, "");
        }
        newData += profileCardHtml;

        return newData;
      });
    }
  }, [selectedAuthor, setEditorData]);

  useEffect(() => {
    if (editorRef.current && editorData) {
      if (editorRef.current.getData() !== editorData) {
        editorRef.current.setData(editorData);
      }
    }
  }, [editorData]);

  const handleSubmit = async () => {
    try {
      const {
        editorData,
        selectedAuthor,
        selectedCategories,
        title,
        subtitle,
        permalink,
        publishTime,
      } = useEditorStore.getState();

      if (!selectedAuthor || !selectedCategories[0]) {
        alert("기사 작성자와 카테고리를 선택해주세요.");
        return;
      }
      const selectedPermalink = selectedCategories[0];
      const selectedCategory = categoryList.find(
        (category) => category.permalink === selectedPermalink
      );

      // 1. 에디터 콘텐츠 가져오기
      const content: string = editorData;

      // 2. 콘텐츠에서 이미지 처리
      const { modifiedContent, imageFiles } = await processEditorContent(
        content
      );

      // 3. 데이터 객체 생성
      const data = {
        editorId: selectedAuthor.id,
        categoryId: selectedCategory?.categoryId,
        // categoryId: 1,
        title: title,
        subtitle: subtitle,
        text: modifiedContent,
        permalink: permalink,
        isPublish: true,
        isMainPublish: true,
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
      const response = await saveEditorContent(formData);
      // console.log("Response:", response);

      // console.log("editorData", editorData);
      // console.log("selectedAuthor", selectedAuthor);
      // console.log("title", title);
      // console.log("subtitle", subtitle);
      // console.log("permalink", permalink);
      // console.log("publishTime", publishTime);
      // console.log("selectedCategories", selectedCategories);

      // 통신 성공 후 permalinks로 이동
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
      {/* <PublishTimeInput /> */}
      <div className="main-container">
        <div className="editor-container pb-1 editor-container_classic-editor editor-container_include-style editor-container_include-block-toolbar">
          <div className="editor-container__editor">
            <CKEditor
              editor={ClassicEditor}
              config={editorConfig}
              data={editorData}
              onChange={handleEditorChange}
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

export default CustomEditor;
