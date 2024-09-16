import { create } from "zustand";
import { Author } from "./authorStore";
import { Category } from "./category";

// Editor Store Interface
interface EditorStore {
  editorData: string;
  selectedAuthor: Author | null;
  categoryList: Category[];
  // 선택된 카테고리의 permalink 배열
  selectedCategories: string[];
  title: string;
  subtitle: string;
  permalink: string;
  // yyyymmddhhmm 형식
  publishTime: string | undefined;
  isSubmitDisabled: boolean;
  setIsSubmitDisabled: (disabled: boolean) => void;
  setEditorData: (data: string | ((prevData: string) => string)) => void;
  setSelectedAuthor: (author: Author) => void;
  setCategoryList: (categories: Category[]) => void;
  setSelectedCategories: (categories: string[]) => void;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  setPermalink: (permalink: string) => void;
  setPublishTime: (publishTime: string | undefined) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  editorData: "",
  selectedAuthor: null,
  categoryList: [],
  selectedCategories: [],
  title: "",
  subtitle: "",
  permalink: "",
  publishTime: "",
  isSubmitDisabled: false,
  setIsSubmitDisabled: (disabled) => set({ isSubmitDisabled: disabled }),
  setEditorData: (data) =>
    set((state) => ({
      editorData: typeof data === "function" ? data(state.editorData) : data,
    })),
  setSelectedAuthor: (author) => set({ selectedAuthor: author }),
  setCategoryList: (categories) => set({ categoryList: categories }),
  setSelectedCategories: (categories) =>
    set({ selectedCategories: categories }),
  setTitle: (title) => set({ title }),
  setSubtitle: (subtitle) => set({ subtitle }),
  setPermalink: (permalink) => set({ permalink }),
  setPublishTime: (publishTime) => set({ publishTime }),
}));
