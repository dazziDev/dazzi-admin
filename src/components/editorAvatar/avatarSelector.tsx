import { useArticleStore } from "@/store/articleStore";
import { Editor, useEditorStore } from "@/store/editorStore";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const AuthorSelector = () => {
  const { editors, fetchEditors } = useEditorStore();
  const { selectedEditor, setSelectedEditor, setArticleData } = useArticleStore();
  const { data: session } = useSession();

  useEffect(() => {
    // 에디터 리스트를 가져옴
    fetchEditors();
  }, [fetchEditors]);

  // 현재 사용자가 생성한 에디터만 필터링
  const userEditors = editors.filter(editor => 
    editor.createdBy === session?.user?.email
  );

  // 에디터 자동 선택 로직
  useEffect(() => {
    if (userEditors.length > 0 && !selectedEditor?.editorId) {
      // 현재 사용자의 첫 번째 에디터를 자동 선택
      setSelectedEditor(userEditors[0]);
      console.log("🎯 자동으로 기사작성자 선택:", userEditors[0].editorName);
    }
  }, [editors, selectedEditor, setSelectedEditor, session, userEditors]);

  const handleAvatarClick = (editor: Editor) => {
    // 선택한 에디터를 아티클 스토어에 저장
    setSelectedEditor(editor);
  };

  // 프로필 카드 수동 삽입 기능 제거됨 - 시스템에서 자동 생성으로 변경

  return (
    <div className="space-y-4">
      {/* 기사작성자 선택 */}
      <div className="flex justify-center space-x-4 mt-4">
        {userEditors.length > 0 ? userEditors.map((editor) => (
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
        )) : (
          <div className="text-center py-4 text-gray-500">
            <p>등록된 프로필이 없습니다.</p>
            <p className="text-sm">먼저 기사작성자 프로필을 등록해주세요.</p>
          </div>
        )}
      </div>
      
      {/* 프로필 카드 수동 삽입 버튼 제거됨 - 시스템에서 자동 생성 */}
    </div>
  );
};

export default AuthorSelector;
