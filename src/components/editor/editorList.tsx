import { useEditorStore } from "@/store/editorStore";
import { useEffect } from "react";
import EditorCard from "./editorCard";

const EditorList = () => {
  const { editors, fetchEditors } = useEditorStore();

  useEffect(() => {
    fetchEditors();
  }, [fetchEditors]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {editors.map((editor) => (
        <EditorCard key={editor.editorId} editor={editor} />
      ))}
    </div>
  );
};

export default EditorList;
