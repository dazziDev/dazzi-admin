import { create } from "zustand";

export interface Author {
  id: number;
  name: string;
  src: string;
  introduction: string;
}

interface ProfileStore {
  authors: Author[];
  selectedAuthor: Author | null;
  addAuthor: (author: Author) => void;
  updateAuthor: (updatedAuthor: Author) => void;
  deleteAuthor: (id: number) => void;
  setSelectedAuthor: (author: Author | null) => void;
}

//dummy data
// 이학찬-LeeHakchan
// 이현우-LeeHyunwoo
// 황용하-HwangYongha
// 정현탁-JungHyuntak
// 박정훈-ParkJunghoon
// 박동민-ParkDongmin
// 박형일-ParkHyungil
// 장태호-JangTaeho
export const initialAuthors: Author[] = [
  {
    id: 1,
    name: "이현우",
    src: "/admin/ParkJunghoon.webp",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
  },
  {
    id: 2,
    name: "황용하",
    src: "/admin/ParkJunghoon.webp",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
  },
  {
    id: 3,
    name: "이학찬",
    src: "/admin/ParkJunghoon.webp",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
  },
  {
    id: 4,
    name: "박동민",
    src: "/admin/ParkDongmin.webp",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
  },
  {
    id: 5,
    name: "정현탁",
    src: "/admin/ParkJunghoon.webp",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
  },
  {
    id: 6,
    name: "장태호",
    src: "/admin/ParkJunghoon.webp",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
  },
  {
    id: 7,
    name: "박형일",
    src: "/admin/ParkJunghoon.webp",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
  },
  {
    id: 8,
    name: "박정훈",
    src: "/admin/ParkJunghoon.webp",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
  },
];
export const useProfileStore = create<ProfileStore>((set) => ({
  authors: initialAuthors,
  selectedAuthor: null,
  addAuthor: (author) =>
    set((state) => ({
      authors: [...state.authors, { ...author, id: Date.now() }],
    })),
  updateAuthor: (updatedAuthor) =>
    set((state) => ({
      authors: state.authors.map((author) =>
        author.id === updatedAuthor.id ? updatedAuthor : author
      ),
    })),
  deleteAuthor: (id) =>
    set((state) => ({
      authors: state.authors.filter((author) => author.id !== id),
    })),
  setSelectedAuthor: (author) => set({ selectedAuthor: author }),
}));

interface EditorStore {
  editorData: string;
  selectedAuthor: Author | null;
  setEditorData: (data: string) => void;
  setSelectedAuthor: (author: Author) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  editorData: "",
  selectedAuthor: null,
  setEditorData: (data) => set({ editorData: data }),
  setSelectedAuthor: (author) => set({ selectedAuthor: author }),
}));
