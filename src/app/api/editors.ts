import { Editor } from "@/store/editorStore";
import axios from "axios";
import axiosInstance from "./axiosInstance";

// 모든 에디터 가져오기
export const fetchEditors = async (): Promise<Editor[]> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/editor/list`
  );

  console.log("fetchEditors", response);

  return response.data.data;
};

// 에디터 추가
export const addEditors = async (data: FormData): Promise<void> => {
  await axiosInstance.post("/editor/add", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 에디터 수정
export const updateEditor = async (
  id: number,
  data: FormData
): Promise<void> => {
  await axiosInstance.put(`/editor/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 에디터 삭제
export const deleteEditor = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/editor/${id}`);
};
