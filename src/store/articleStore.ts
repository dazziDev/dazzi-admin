import { create } from "zustand";
import { Editor } from "./editorStore";

interface ArticleStore {
  articleData: string;
  // 여기 에디터는 기사작성자를 의미
  selectedEditor: Editor | null;
  setSelectedEditor: (editor: Editor) => void;
  // 카테고리 같은경우는 카테고리 API로 받아온 데이터를 사용
  // 미구현
  selectedCategories: string[];
  title: string;
  subtitle: string;
  permalink: string;
  publishTime: string | undefined;
  isSubmitDisabled: boolean;
  isPublish: boolean;
  isMainPublish: boolean;
  setIsSubmitDisabled: (disabled: boolean) => void;
  setArticleData: (data: string | ((prevData: string) => string)) => void;
  setSelectedCategories: (categories: string[]) => void;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  setPermalink: (permalink: string) => void;
  setPublishTime: (publishTime: string | undefined) => void;
  setIsPublish: (publish: boolean) => void;
  setIsMainPublish: (mainPublish: boolean) => void;
}

export const useArticleStore = create<ArticleStore>((set) => ({
  articleData: "",
  selectedEditor: null,
  setSelectedEditor: (editor) => set({ selectedEditor: editor }),
  selectedCategories: [],
  title: "",
  subtitle: "",
  permalink: "",
  publishTime: "",
  isSubmitDisabled: false,
  isPublish: true,
  isMainPublish: false,
  setIsSubmitDisabled: (disabled) => set({ isSubmitDisabled: disabled }),
  setArticleData: (data) =>
    set((state) => ({
      articleData: typeof data === "function" ? data(state.articleData) : data,
    })),
  setSelectedCategories: (categories) =>
    set({ selectedCategories: categories }),
  setTitle: (title) => set({ title }),
  setSubtitle: (subtitle) => set({ subtitle }),
  setPermalink: (permalink) => set({ permalink }),
  setPublishTime: (publishTime) => set({ publishTime }),
  setIsPublish: (publish) => set({ isPublish: publish }),
  setIsMainPublish: (mainPublish) => set({ isMainPublish: mainPublish }),
}));
