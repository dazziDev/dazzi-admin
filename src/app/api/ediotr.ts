// src/lib/api.ts
import axios from "axios";

interface SaveContentResponse {
  success: boolean;
  [key: string]: any;
}

/**
 * 콘텐츠와 이미지를 백엔드로 전송합니다.
 * @param formData 수정된 콘텐츠와 이미지 파일이 포함된 FormData 객체
 * @returns 백엔드 응답
 */
export async function saveEditorContent(
  formData: FormData
): Promise<SaveContentResponse> {
  console.log("formData", formData);
  try {
    const response = await axios.post("/api/save-content", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to save content:", error);
    throw error;
  }
}
