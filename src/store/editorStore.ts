import {
  addEditors as apiAddEditor,
  fetchEditors as apiFetchEditors,
} from "@/app/api/editors";
import { create } from "zustand";

export interface Editor {
  editorId: string;
  editorName: string;
  description: string;
  // 기사 작성자 이미지(동그라미)
  articleImage: string;
  // 에디터 소개 이미지(사각형)
  introduceImage: string;
}

interface EditorStore {
  editors: Editor[];
  fetchEditors: () => Promise<void>;
  addEditor: (editorData: FormData) => Promise<void>;
}

export const useEditorStore = create<EditorStore>((set) => ({
  editors: [],
  fetchEditors: async () => {
    const editors = await apiFetchEditors();
    set({ editors });
  },
  addEditor: async (editorData) => {
    await apiAddEditor(editorData);
    const editors = await apiFetchEditors();
    set({ editors });
  },
}));
