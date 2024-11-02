import axiosInstance from "./axiosInstance";

/**
 * 콘텐츠와 이미지를 백엔드로 전송합니다.
 * @param formData 수정된 콘텐츠와 이미지 파일이 포함된 FormData 객체
 * @returns 백엔드 응답
 */
export async function saveArticleContent(formData: FormData): Promise<string> {
  try {
    // get할때 permalinks endpoint
    const response = await axiosInstance.post("/article/add", formData);

    console.log("response1111", response);
    console.log("response333", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to save content:", error);
    throw error;
  }
}

export async function fetchArticleDetail(permalink: string) {
  try {
    const response = await axiosInstance.get(`/article/detail/${permalink}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch article detail:", error);
    throw error;
  }
}
