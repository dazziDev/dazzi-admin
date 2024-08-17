"use client";

import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editorStore";
import { useParams, useRouter } from "next/navigation";

const PreviewPage: React.FC = () => {
  const { editorData } = useEditorStore();
  console.log("editorData", editorData);
  const router = useRouter();
  const uid = useParams().id;
  console.log("uid", uid);

  const handleEdit = () => {
    router.push("/editor");
  };

  return (
    <div>
      <Button className="absolute top-26 right-4" onClick={handleEdit}>
        수정하기
      </Button>
      <p>({uid})</p>
      <h1 className="pb-10 text-2xl font-bold">Preview</h1>
      <div className="border-b-2 border-gray-200 mb-4"></div>
      <div dangerouslySetInnerHTML={{ __html: editorData }} />
    </div>
  );
};

export default PreviewPage;
