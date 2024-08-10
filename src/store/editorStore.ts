import { create } from "zustand";

interface EditorStore {
  editorData: string;
  setEditorData: (data: string) => void;
}
// data:any 一時的に
export const useEditorStore = create<EditorStore>((set) => ({
  editorData: "",
  setEditorData: (data) => set({ editorData: data }),
}));
