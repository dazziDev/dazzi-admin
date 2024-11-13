/**
 * 에디터 콘텐츠에서 이미지를 추출하고, Base64 이미지를 File 객체로 변환합니다.
 * 또한 콘텐츠 내의 이미지 src를 플레이스홀더로 대체합니다.
 * @param content 에디터 콘텐츠 (HTML 문자열)
 * @param thumbnailUrl 썸네일 이미지의 URL (옵션)
 * @returns 수정된 콘텐츠와 이미지 파일 배열
 */
export async function processArticleContent(
  content: string,
  thumbnailUrl?: string
): Promise<{
  modifiedContent: string;
  imageFiles: File[];
}> {
  const imgRegex = /<img[^>]+src="data:image\/[^">]+"[^>]*>/g;
  const imagesInContent = content.match(imgRegex) || [];

  const imageFiles: File[] = [];
  let modifiedContent = content;

  // 1. 썸네일 이미지를 맨 앞에 추가
  if (thumbnailUrl) {
    const thumbnailBlob = await fetch(thumbnailUrl).then((res) => res.blob());
    const thumbnailFile = new File([thumbnailBlob], "image_0.jpg", {
      type: "image/jpeg",
    });
    imageFiles.push(thumbnailFile);
  }

  // 2. 에디터 내 이미지 처리 (index를 1부터 시작)
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

      // Blob을 File 객체로 변환 (이름을 image_1, image_2, ...으로 설정)
      const file = new File([blob], `image_${i + 1}.png`, { type: blob.type });
      imageFiles.push(file);

      // 콘텐츠 내의 이미지 src를 플레이스홀더로 대체
      modifiedContent = modifiedContent.replace(
        dataUrl,
        `__IMAGE_PLACEHOLDER_${i + 1}__`
      );
    }
  }

  console.log("modifiedContent", modifiedContent);
  console.log("imageFiles", imageFiles);
  return { modifiedContent, imageFiles };
}
