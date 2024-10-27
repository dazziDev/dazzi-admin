import { useArticleStore } from "@/store/articleStore";
import { Editor, useEditorStore } from "@/store/editorStore";
import Image from "next/image";
import { useEffect } from "react";

const EditorSelector = () => {
  const { editors, fetchEditors } = useEditorStore();
  const { selectedEditor, setSelectedEditor } = useArticleStore();

  useEffect(() => {
    // 에디터 리스트를 가져옴
    fetchEditors();
  }, [fetchEditors]);

  const handleAvatarClick = (editor: Editor) => {
    // 선택한 에디터를 아티클 스토어에 저장
    setSelectedEditor(editor);
  };

  return (
    <div className="flex justify-center space-x-4 mt-4 mb-4">
      {editors.map((editor) => (
        <div
          key={editor.editorId}
          className={`group cursor-pointer text-center transition-transform duration-300 ${
            selectedEditor?.editorId === editor.editorId
              ? "scale-110"
              : "opacity-50"
          }`}
          onClick={() => handleAvatarClick(editor)}
        >
          <div className="relative">
            <Image
              src={editor.articleImage}
              alt={editor.editorName}
              width={60}
              height={60}
              className={`rounded-full shadow-md transition-all duration-300 ${
                selectedEditor?.editorId === editor.editorId
                  ? "ring-4 ring-blue-500 opacity-100"
                  : "group-hover:opacity-75 group-hover:brightness-110"
              }`}
            />
          </div>
          <p
            className={`mt-2 text-sm font-semibold transition-all duration-300 ${
              selectedEditor?.editorId === editor.editorId
                ? "text-gray-900"
                : "text-gray-500 group-hover:text-gray-700"
            }`}
          >
            {editor.editorName}
          </p>
        </div>
      ))}
    </div>
  );
};

export default EditorSelector;
