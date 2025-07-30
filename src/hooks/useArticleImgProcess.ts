import { generateEnglishFilename, getFileExtension } from '@/lib/fileUtils';

/**
 * 에디터 콘텐츠에서 이미지를 추출하고, Base64 이미지를 File 객체로 변환합니다.
 * 또한 콘텐츠 내의 이미지 src를 플레이스홀더로 대체합니다.
 * @param content 에디터 콘텐츠 (HTML 문자열)
 * @param thumbnailUrls 썸네일 이미지들의 URL 배열 [가로형, 세로형] (옵션)
 * @param isEditMode 수정 모드 여부
 * @returns 수정된 콘텐츠와 이미지 파일 배열
 */
export async function processArticleContent(
  content: string,
  thumbnailUrls?: string | string[],
  isEditMode = false
): Promise<{
  modifiedContent: string;
  imageFiles: File[];
}> {
  const imgRegex = /<img[^>]+src="data:image\/[^">]+"[^>]*>/g;
  const imagesInContent = content.match(imgRegex) || [];

  const imageFiles: File[] = [];
  let modifiedContent = content;

  // 1. 듀얼 썸네일 이미지 처리 (수정 모드에서는 S3 URL fetch 하지 않음)
  if (thumbnailUrls && !isEditMode) {
    // 이전 버전 호환성을 위해 단일 문자열도 허용
    const thumbnailArray = Array.isArray(thumbnailUrls)
      ? thumbnailUrls
      : [thumbnailUrls];

    for (let i = 0; i < thumbnailArray.length; i++) {
      const thumbnailUrl = thumbnailArray[i];
      if (thumbnailUrl) {
        try {
          const thumbnailBlob = await fetch(thumbnailUrl).then((res) =>
            res.blob()
          );
          const englishFilename = generateEnglishFilename('.jpg');
          const thumbnailFile = new File([thumbnailBlob], englishFilename, {
            type: "image/jpeg",
          });
          imageFiles.push(thumbnailFile);
        } catch (error) {
          console.warn(`썸네일 ${i + 1} 이미지 fetch 실패:`, error);
        }
      }
    }
  }

  // 2. 에디터 내 이미지 처리 (썸네일 다음 인덱스부터 시작)
  const thumbnailCount = Array.isArray(thumbnailUrls)
    ? thumbnailUrls.filter(Boolean).length
    : thumbnailUrls
    ? 1
    : 0;

  for (let i = 0; i < imagesInContent.length; i++) {
    const imgTag = imagesInContent[i];

    // 이미지의 src 추출
    const srcRegex = /src="([^"]+)"/;
    const srcMatch = imgTag.match(srcRegex);
    if (srcMatch && srcMatch[1]) {
      const dataUrl = srcMatch[1];

      // Base64 데이터 URL을 Blob으로 변환
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      // 확장자 추출 (blob.type에서)
      const extension = blob.type === 'image/png' ? '.png' : '.jpg';
      const englishFilename = generateEnglishFilename(extension);
      
      // Blob을 File 객체로 변환 (영어 파일명 사용)
      const file = new File([blob], englishFilename, {
        type: blob.type,
      });
      imageFiles.push(file);

      // 콘텐츠 내의 이미지 src를 플레이스홀더로 대체
      modifiedContent = modifiedContent.replace(
        dataUrl,
        `__IMAGE_PLACEHOLDER_${i + 1}__`
      );
    }
  }

  return { modifiedContent, imageFiles };
}
