"use client";
import { ClassicEditor } from "ckeditor5";

import { saveEditorContent } from "@/app/api/ediotr";
import { editorConfig } from "@/config/editorConfig";
import { processEditorContent } from "@/lib/utils";
import { useEditorStore } from "@/store/editorStore";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5/ckeditor5.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import AvatarSelector from "../adminAvatar/avatarSelector";
import { Button } from "../ui/button";

const CustomEditor: React.FC = () => {
  const editorRef = useRef<ClassicEditor | null>(null);
  const { editorData, setEditorData, selectedAuthor } = useEditorStore();
  const router = useRouter();
  console.log("editorData", editorData);
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

      let newData = editorData;

      const profileCardRegex = /<div class="raw-html-embed">[\s\S]*?<\/div>/g;
      if (profileCardRegex.test(newData)) {
        newData = newData.replace(profileCardRegex, "");
      }
      newData += profileCardHtml;

      setEditorData(newData);
    }
  }, [selectedAuthor]);

  useEffect(() => {
    if (editorRef.current && editorData) {
      editorRef.current.setData(editorData);
    }
  }, [editorData]);

  // const handleSubmit = () => {
  //   const uniqueId = Date.now().toString();
  //   router.push(`/preview/${uniqueId}`);
  // };
  const handleSubmit = async () => {
    try {
      // 1. 에디터 콘텐츠 가져오기
      const content: string = editorData;

      // 2. 콘텐츠에서 이미지 처리 (유틸리티 함수 사용)
      const { modifiedContent, imageFiles } = await processEditorContent(
        content
      );

      // 3. FormData 생성 및 데이터 추가
      const formData = new FormData();
      formData.append("content", modifiedContent);
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      // 4. 백엔드로 데이터 전송 (API 함수 사용)
      await saveEditorContent(formData);
      console.log("formData", formData);
      // 성공 시 페이지 이동 또는 알림 표시
      const uniqueId = Date.now().toString();
      router.push(`/preview/${uniqueId}`);
    } catch (error) {
      console.error("Failed to save content:", error);
      // 에러 처리 로직 추가 (예: 알림 표시)
    }
  };

  return (
    <div className="relative pb-16 max-w-5xl mx-auto">
      <AvatarSelector />
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
        >
          확인
        </Button>
      </div>
    </div>
  );
};

export default CustomEditor;
