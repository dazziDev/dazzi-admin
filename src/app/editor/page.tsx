"use client";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const CustomEditor = dynamic(() => import("@/components/editor/customEditor"), {
  ssr: false,
});

const EditorPage: React.FC = () => {
  const router = useRouter();

  const handleSubmit = () => {
    // 게시물 고유번호 넣어주기
    const uniqueId = Date.now();
    router.push(`/preview/${uniqueId}`);
  };

  return (
    <div>
      <Button onClick={handleSubmit}>등록</Button>
      <CustomEditor />
    </div>
  );
};

export default EditorPage;
