import {
  addAuthor as apiAddAuthor,
  deleteAuthor as apiDeleteAuthor,
  fetchAuthors as apiFetchAuthors,
  updateAuthor as apiUpdateAuthor,
} from "@/app/api/authors";
import { create } from "zustand";

export interface Author {
  id: number;
  name: string;
  introduction: string;
  // 동그라미 이미지 URL
  src: string;
  // 사각형 이미지 URL
  rectSrc: string;
}

interface AuthorStore {
  authors: Author[];
  fetchAuthors: () => Promise<void>;
  addAuthor: (authorData: FormData) => Promise<void>;
  updateAuthor: (id: number, authorData: FormData) => Promise<void>;
  deleteAuthor: (id: number) => Promise<void>;
}

export const useAuthorStore = create<AuthorStore>((set) => ({
  authors: [],
  fetchAuthors: async () => {
    const authors = await apiFetchAuthors();
    set({ authors });
  },
  addAuthor: async (authorData) => {
    await apiAddAuthor(authorData);
    const authors = await apiFetchAuthors();
    set({ authors });
  },
  updateAuthor: async (id, authorData) => {
    await apiUpdateAuthor(id, authorData);
    const authors = await apiFetchAuthors();
    set({ authors });
  },
  deleteAuthor: async (id) => {
    await apiDeleteAuthor(id);
    const authors = await apiFetchAuthors();
    set({ authors });
  },
}));

// 삭제 예정
export const initialAuthors: Author[] = [
  {
    id: 1,
    name: "이현우",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
    src: "/admin/ParkJunghoon.webp",
    rectSrc: "/admin/ParkJunghoon.webp",
  },
  {
    id: 2,
    name: "황용하",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
    src: "/admin/ParkJunghoon.webp",
    rectSrc: "/admin/ParkJunghoon.webp",
  },
  {
    id: 3,
    name: "이학찬",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
    src: "/admin/ParkJunghoon.webp",
    rectSrc: "/admin/ParkJunghoon.webp",
  },
  {
    id: 4,
    name: "박동민",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
    src: "/admin/ParkDongmin.webp",
    rectSrc: "/admin/ParkJunghoon.webp",
  },
  {
    id: 5,
    name: "정현탁",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
    src: "/admin/ParkJunghoon.webp",
    rectSrc: "/admin/ParkJunghoon.webp",
  },
  {
    id: 6,
    name: "장태호",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
    src: "/admin/ParkJunghoon.webp",
    rectSrc: "/admin/ParkJunghoon.webp",
  },
  {
    id: 7,
    name: "박형일",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
    src: "/admin/ParkJunghoon.webp",
    rectSrc: "/admin/ParkJunghoon.webp",
  },
  {
    id: 8,
    name: "박정훈",
    introduction:
      "안녕하세요 저는 일본 오타쿠 개발자입니다(기존소개글 or 추후(수정)가능)",
    src: "/admin/ParkJunghoon.webp",
    rectSrc: "/admin/ParkJunghoon.webp",
  },
];
