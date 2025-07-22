import { Editor } from "@/store/editorStore";
import axiosInstance from "./axiosInstance";

// 모든 에디터 가져오기
export const fetchEditors = async (): Promise<Editor[]> => {
  const response = await axiosInstance.get("/editor/list");

  console.log("fetchEditors", response);
  console.log("fetchEditors 데이터:", response.data.data);
  
  // 각 에디터의 createdBy 필드 확인
  response.data.data.forEach((editor: Editor, index: number) => {
    console.log(`에디터 ${index + 1}:`, {
      이름: editor.editorName,
      작성자: editor.createdBy
    });
  });

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
  id: string,
  data: FormData
): Promise<void> => {
  await axiosInstance.put(`/editor/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 에디터 삭제
export const deleteEditor = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/editor/${id}`);
};
