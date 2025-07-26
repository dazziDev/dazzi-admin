import { useArticleStore } from "@/store/articleStore";
import { Editor, useEditorStore } from "@/store/editorStore";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
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

  // 프로필 카드를 수동으로 에디터에 삽입하는 함수
  const insertProfileCard = () => {
    if (!selectedEditor || !selectedEditor.editorId) {
      alert("먼저 기사작성자를 선택해주세요.");
      return;
    }

    const profileCardHtml = `
      <div class="raw-html-embed">
        <div class="flex justify-center">
          <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/editors/${selectedEditor.editorId}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">
            <div class="profile-card flex" style="width:80%; display:flex; align-items: center; padding: 10px; border: 1px solid #e0e0e0; border-radius: 12px; margin-top: 32px; background-color: #f9f9f9; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); cursor: pointer; transition: all 0.3s ease;">
              <img src="${selectedEditor.articleImage}" alt="name" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px; border: 2px solid #007bff; loading: lazy;">
              <div>
                <strong style="font-size: 1.1rem; color: #333;">${selectedEditor.editorName}</strong>
                <p style="margin: 5px 0 0; font-size: 0.9rem; color: #666;">${selectedEditor.description}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    `;

    setArticleData((prevData) => {
      // 기존 프로필 카드가 있는지 확인
      const profileCardRegex = /<div class="raw-html-embed">[\s\S]*?<\/div>/g;
      const hasExistingCard = profileCardRegex.test(prevData);
      
      if (hasExistingCard) {
        // 기존 카드가 있으면 교체
        const newData = prevData.replace(profileCardRegex, "") + profileCardHtml;
        console.log("🔄 기존 프로필 카드를 새 카드로 교체했습니다.");
        return newData;
      } else {
        // 기존 카드가 없으면 추가
        const newData = prevData + profileCardHtml;
        console.log("➕ 프로필 카드를 에디터에 추가했습니다.");
        return newData;
      }
    });
  };

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
      
      {/* 프로필 카드 삽입 버튼 */}
      {selectedEditor && (
        <div className="flex justify-center">
          <Button
            onClick={insertProfileCard}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <UserPlus size={16} />
            프로필 카드 삽입
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuthorSelector;
