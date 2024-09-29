/**
 * 에디터 콘텐츠에서 이미지를 추출하고, Base64 이미지를 File 객체로 변환합니다.
 * 또한 콘텐츠 내의 이미지 src를 플레이스홀더로 대체합니다.
 * @param content 에디터 콘텐츠 (HTML 문자열)
 * @returns 수정된 콘텐츠와 이미지 파일 배열
 */
//  __IMAGE_PLACEHOLDER_ 백엔드 대화
//  __IMAGE_PLACEHOLDER_ 백엔드 대화
//  __IMAGE_PLACEHOLDER_ 백엔드 대화
export async function processEditorContent(content: string): Promise<{
  modifiedContent: string;
  imageFiles: File[];
}> {
  const imgRegex = /<img[^>]+src="data:image\/[^">]+"[^>]*>/g;
  const imagesInContent = content.match(imgRegex) || [];

  const imageFiles: File[] = [];
  let modifiedContent = content;

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

      // Blob을 File 객체로 변환
      const file = new File([blob], `image_${i}.png`, { type: blob.type });

      imageFiles.push(file);

      // 콘텐츠 내의 이미지 src를 플레이스홀더로 대체
      modifiedContent = modifiedContent.replace(
        dataUrl,
        `__IMAGE_PLACEHOLDER_${i}__`
      );
    }
  }
  // console.log("modifiedContent", modifiedContent);
  console.log("imageFiles", imageFiles);
  return { modifiedContent, imageFiles };
}
