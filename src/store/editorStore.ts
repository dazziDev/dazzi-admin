import {
  addEditors as apiAddEditor,
  fetchEditors as apiFetchEditors,
} from "@/app/api/editors";
import { create } from "zustand";

export interface Editor {
  editorId: string;
  editorName: string;
  description: string;
  articleImage: string;
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
