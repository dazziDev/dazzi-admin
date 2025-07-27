import {
  addEditors as apiAddEditor,
  fetchEditors as apiFetchEditors,
  updateEditor as apiUpdateEditor,
  deleteEditor as apiDeleteEditor,
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
  // 작성자 이메일 (권한 확인용)
  createdBy?: string;
  // SNS 링크들
  instagramUrl?: string;
  youtubeUrl?: string;
  xUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
}

interface EditorStore {
  editors: Editor[];
  fetchEditors: () => Promise<void>;
  addEditor: (editorData: FormData) => Promise<void>;
  updateEditor: (id: string, editorData: FormData) => Promise<void>;
  deleteEditor: (id: string) => Promise<void>;
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
  updateEditor: async (id, editorData) => {
    await apiUpdateEditor(id, editorData);
    const editors = await apiFetchEditors();
    set({ editors });
  },
  deleteEditor: async (id) => {
    await apiDeleteEditor(id);
    const editors = await apiFetchEditors();
    set({ editors });
  },
}));
