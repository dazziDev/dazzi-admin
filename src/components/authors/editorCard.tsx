import { Button } from "@/components/ui/button";
import { Editor } from "@/store/editorStore";
import Image from "next/image";
import { useState } from "react";
import EditorForm from "./editorForm";

interface EditorCardProps {
  editor: Editor;
}

const EditorCard = ({ editor }: EditorCardProps) => {
  // const { deleteEditor } = useEditorStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    // await deleteEditor(editor.editorId);
  };

  const handleEdit = () => {
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
      />
      <h2 className="mt-2 text-center font-semibold text-lg">
        {editor.editorName}
      </h2>
      <p className="text-center text-gray-600">{editor.description}</p>
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
          />
        </div>
      )}
      <div className="mt-4 flex justify-center space-x-2">
        <Button onClick={handleEdit}>수정</Button>
        <Button variant="destructive" onClick={handleDelete}>
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
