import { create } from "zustand";
import { Editor } from "./editorStore";

interface ArticleStore {
  articleData: string;
  // 미리보기용 고정 콘텐츠 (무한 요청 방지)
  previewContent: string | null;
  // 여기 에디터는 기사작성자를 의미
  selectedEditor: Editor;
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
  thumbnail: string | null;
  landscapeThumbnail: string | null;
  portraitThumbnail: string | null;
  setIsSubmitDisabled: (disabled: boolean) => void;
  setArticleData: (data: string | ((prevData: string) => string)) => void;
  setPreviewContent: (content: string | null) => void;
  setSelectedCategories: (categories: string[]) => void;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  setPermalink: (permalink: string) => void;
  setPublishTime: (publishTime: string | undefined) => void;
  setIsPublish: (publish: boolean) => void;
  setIsMainPublish: (mainPublish: boolean) => void;
  setThumbnail: (image: string | null) => void;
  setLandscapeThumbnail: (image: string | null) => void;
  setPortraitThumbnail: (image: string | null) => void;
}

export const useArticleStore = create<ArticleStore>((set) => ({
  articleData: "",
  previewContent: null,
  selectedEditor: {
    editorId: "",
    editorName: "",
    description: "",
    articleImage: "",
    introduceImage: "",
  },
  setSelectedEditor: (editor) => set({ selectedEditor: editor }),
  selectedCategories: [],
  title: "",
  subtitle: "",
  permalink: "",
  publishTime: undefined,
  isSubmitDisabled: false,
  isPublish: true,
  isMainPublish: false,
  thumbnail: null,
  landscapeThumbnail: null,
  portraitThumbnail: null,
  setIsSubmitDisabled: (disabled) => set({ isSubmitDisabled: disabled }),
  setArticleData: (data) =>
    set((state) => ({
      articleData: typeof data === "function" ? data(state.articleData) : data,
    })),
  setPreviewContent: (content) => set({ previewContent: content }),
  setSelectedCategories: (categories) =>
    set({ selectedCategories: categories }),
  setTitle: (title) => set({ title }),
  setSubtitle: (subtitle) => set({ subtitle }),
  setPermalink: (permalink) => set({ permalink }),
  setPublishTime: (publishTime) => set({ publishTime }),
  setIsPublish: (publish) => set({ isPublish: publish }),
  setIsMainPublish: (mainPublish) => set({ isMainPublish: mainPublish }),
  setThumbnail: (image) => set({ thumbnail: image }),
  setLandscapeThumbnail: (image) => set({ landscapeThumbnail: image }),
  setPortraitThumbnail: (image) => set({ portraitThumbnail: image }),
}));
