"use client";
import EditorForm from "@/components/editor/editorForm";
import EditorList from "@/components/editor/editorList";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useState } from "react";

const EditorPage = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { data: session } = useSession();

  const handleAddNew = () => {
    setIsAdding(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">기사작성자 관리</h1>
          <p className="text-gray-600 mt-1">
            현재 로그인: <span className="font-medium">{session?.user?.name}</span> ({session?.user?.email})
          </p>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-blue-800 font-medium mb-2">💡 사용 안내</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• 기사작성자는 기사 하단에 표시되는 작성자 정보입니다</li>
          <li>• 기사 작성 시 첫 번째 기사작성자가 자동으로 선택됩니다</li>
          <li>• 여러 작성자를 만들어서 다양한 필명으로 기사를 작성할 수 있습니다</li>
        </ul>
      </div>

      <EditorList />
      <div className="mt-8">
        <Button onClick={handleAddNew} className="w-full">
          + 새 기사작성자 추가
        </Button>
      </div>
      {isAdding && <EditorForm onClose={() => setIsAdding(false)} />}
    </div>
  );
};

export default EditorPage;
