import { Button } from "@/components/ui/button";
import { Editor, useEditorStore } from "@/store/editorStore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { handleImageError } from "@/lib/imageUtils";
import EditorForm from "./editorForm";

interface EditorCardProps {
  editor: Editor;
}

const EditorCard = ({ editor }: EditorCardProps) => {
  const editorStore = useEditorStore();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  // 현재 사용자가 이 에디터의 작성자인지 확인
  // createdBy가 없는 기존 에디터들은 모든 사용자가 수정 가능
  const canEdit = !editor.createdBy || session?.user?.email === editor.createdBy;
  
  // 디버깅 로그
  console.log('현재 세션 이메일:', session?.user?.email);
  console.log('에디터 작성자:', editor.createdBy);
  console.log('수정 가능 여부:', canEdit);

  const handleDelete = async () => {
    if (!canEdit) return;
    
    if (confirm('정말로 이 에디터를 삭제하시겠습니까?')) {
      try {
        await (editorStore as any).deleteEditor(editor.editorId);
      } catch (error) {
        console.error('에디터 삭제 실패:', error);
        alert('에디터 삭제에 실패했습니다.');
      }
    }
  };

  const handleEdit = () => {
    if (!canEdit) return;
    setIsEditing(true);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <Image
        src={editor.articleImage}
        alt={editor.editorName}
        width={100}
        height={100}
        className="rounded-full mx-auto"
        onError={handleImageError}
        unoptimized={editor.articleImage.includes('amazonaws.com')}
      />
      <h2 className="mt-2 text-center font-semibold text-lg">
        <a 
          href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/editors/${editor.editorId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors cursor-pointer"
        >
          {editor.editorName}
        </a>
      </h2>
      <p className="text-center text-gray-600">{editor.description}</p>
      {editor.createdBy && (
        <p className="text-xs text-gray-400 text-center mt-1">
          작성자: {editor.createdBy}
        </p>
      )}
      <div className="mt-4 text-center">프로필 이미지↓</div>
      {editor.introduceImage && (
        <div className="mt-4">
          <Image
            src={editor.introduceImage}
            alt={`${editor.editorName} 직사각형 이미지`}
            width={339}
            height={194}
            className="mx-auto"
            style={{
              width: "339px",
              height: "194px",
              borderRadius: "12px",
              objectFit: "cover",
            }}
            onError={handleImageError}
            unoptimized={editor.introduceImage.includes('amazonaws.com')}
          />
        </div>
      )}
      <div className="mt-4 flex justify-center space-x-2">
        <Button 
          disabled={!canEdit} 
          onClick={handleEdit}
          className={!canEdit ? "opacity-50 cursor-not-allowed" : ""}
        >
          수정
        </Button>
        <Button 
          disabled={!canEdit} 
          variant="destructive" 
          onClick={handleDelete}
          className={!canEdit ? "opacity-50 cursor-not-allowed" : ""}
        >
          삭제
        </Button>
      </div>
      {isEditing && (
        <EditorForm
          initialEditor={editor}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default EditorCard;
