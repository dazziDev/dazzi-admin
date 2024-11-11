"use client";
import { Button } from "@/components/ui/button";
import { useArticleStore } from "@/store/articleStore";
import "ckeditor5/ckeditor5.css";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const PreviewPage = () => {
  const { articleData: editorData } = useArticleStore();
  const router = useRouter();
  const uid = useParams().id;
  const [isMobileView, setIsMobileView] = useState(false);

  const handleEdit = () => {
    router.push("/editor");
  };

  const toggleViewMode = () => {
    setIsMobileView(!isMobileView);
  };
  console.log("editorData222", editorData);
  return (
    <div className="relative pb-20 max-w-5xl mx-auto bg-white p-4">
      <div className="flex justify-end space-x-2">
        <Button onClick={toggleViewMode}>
          {!isMobileView ? "Mobile" : "PC"}
        </Button>
        <Button disabled onClick={handleEdit}>
          수정하기
        </Button>
      </div>
      <p>({uid})</p>
      <h1 className="pb-10 text-2xl font-bold">Preview</h1>
      <div className="border-b-2 border-gray-200 mb-4"></div>

      {!isMobileView ? (
        <div className="flex justify-center">
          <div className="relative w-[375px] h-[812px] bg-black rounded-[40px] overflow-hidden shadow-lg border-8 border-black">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[210px] h-[30px] bg-black rounded-b-[15px]"></div>
            <div className="absolute top-[40px] bottom-[40px] left-0 right-0 bg-white overflow-y-auto p-4">
              <div
                className="ck-content"
                dangerouslySetInnerHTML={{ __html: editorData }}
              />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[130px] h-[5px] bg-gray-400 rounded-full"></div>
          </div>
        </div>
      ) : (
        <div
          className="ck-content"
          dangerouslySetInnerHTML={{ __html: editorData }}
        />
      )}
    </div>
  );
};

export default PreviewPage;
