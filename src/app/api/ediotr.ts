import axios from "axios";

interface SaveContentResponse {
  articleId: number;
  permalink: string;
}

/**
 * 콘텐츠와 이미지를 백엔드로 전송합니다.
 * @param formData 수정된 콘텐츠와 이미지 파일이 포함된 FormData 객체
 * @returns 백엔드 응답
 */
export async function saveEditorContent(
  formData: FormData
): Promise<SaveContentResponse> {
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }
  try {
    // get할때 permalinks endpoint
    const response = await axios.post(
      `http://localhost/api/v1/admin/article/add`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to save content:", error);
    throw error;
  }
}
