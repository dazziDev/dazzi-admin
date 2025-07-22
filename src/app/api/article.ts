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
    
    // 에러 응답 처리
    if (response.data && response.data.code) {
      // 에러 응답인 경우
      if (response.data.code === 'CE0001') {
        throw new Error('이미 사용 중인 퍼머링크입니다. 다른 퍼머링크를 입력해주세요.');
      }
      throw new Error(response.data.message || '기사 저장에 실패했습니다.');
    }
    
    // 성공 응답에서 permalink 추출
    if (typeof response.data === 'string') {
      return response.data;
    } else if (response.data && response.data.permalink) {
      return response.data.permalink;
    }
    
    throw new Error('예상치 못한 응답 형식입니다.');
  } catch (error: any) {
    console.error("Failed to save content:", error);
    
    // axios 에러에서 응답 데이터 확인
    if (error.response && error.response.data) {
      if (error.response.data.code === 'CE0001') {
        throw new Error('이미 사용 중인 퍼머링크입니다. 다른 퍼머링크를 입력해주세요.');
      }
      throw new Error(error.response.data.message || '기사 저장에 실패했습니다.');
    }
    
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

/**
 * 기사를 수정합니다.
 * @param articleId 수정할 기사의 ID
 * @param formData 수정된 콘텐츠와 이미지 파일이 포함된 FormData 객체
 * @returns 백엔드 응답
 */
export async function updateArticleContent(articleId: string, formData: FormData): Promise<string> {
  try {
    const response = await axiosInstance.put(`/article/edit/${articleId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("updateArticleContent response:", response);
    return articleId; // 수정 시에는 기존 ID 반환
  } catch (error) {
    console.error("Failed to update article:", error);
    throw error;
  }
}
