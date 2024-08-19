"use client";
import { ClassicEditor } from "ckeditor5";

import { editorConfig } from "@/config/editorConfig";
import { useEditorStore } from "@/store/editorStore";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5/ckeditor5.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";

const CustomEditor: React.FC = () => {
  const editorRef = useRef<ClassicEditor | null>(null);
  const { editorData, setEditorData } = useEditorStore();
  const router = useRouter();
  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    // data = data.replace(
    //   /<figure class="image">/g,
    //   '<figure class="image ck-widget ck-widget_with-resizer" contenteditable="false">'
    // );

    setEditorData(data);
    console.log("data", data);
  };

  useEffect(() => {
    if (editorRef.current && editorData) {
      editorRef.current.setData(editorData);
    }
  }, [editorData]);

  const handleSubmit = () => {
    const uniqueId = Date.now().toString();
    router.push(`/preview/${uniqueId}`);
  };

  return (
    <div className="relative pb-16">
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
