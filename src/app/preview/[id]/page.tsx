"use client";

import { useEditorStore } from "@/store/editorStore";

const PreviewPage: React.FC = () => {
  const { editorData } = useEditorStore();
  console.log("editorData", editorData);
  return (
    <div>
      <h1>Preview</h1>
      <div dangerouslySetInnerHTML={{ __html: editorData }} />
    </div>
  );
};

export default PreviewPage;
