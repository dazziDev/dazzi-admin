import { Author, initialAuthors } from "@/store/authorStore";
import axiosInstance from "./axiosInstance";

// 모든 에디터 가져오기
export const fetchAuthors = async (): Promise<Author[]> => {
  // 임시로 initialAuthors를 반환하도록 구현
  return initialAuthors;
  // const response = await axiosInstance.get("/authors");
  // return response.data;
};

// 에디터 추가
export const addAuthor = async (data: FormData): Promise<void> => {
  await axiosInstance.post("/authors", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 에디터 수정
export const updateAuthor = async (
  id: number,
  data: FormData
): Promise<void> => {
  await axiosInstance.put(`/authors/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 에디터 삭제
export const deleteAuthor = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/authors/${id}`);
};
