import { create } from "zustand";

export interface Author {
  name: string;
  src: string;
}

interface EditorStore {
  editorData: string;
  selectedAuthor: Author | null;
  setEditorData: (data: string) => void;
  clearEditorData: () => void;
  setSelectedAuthor: (author: Author) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  editorData: "",
  selectedAuthor: null,
  setEditorData: (data) => set({ editorData: data }),
  clearEditorData: () => set({ editorData: "" }),
  setSelectedAuthor: (author) => set({ selectedAuthor: author }),
}));
