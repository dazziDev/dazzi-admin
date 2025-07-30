/**
 * ファイル名を英語で生成するユーティリティ関数
 */

/**
 * 영어 파일명 생성 (타임스탬프 + 랜덤)
 * @param extension 확장자 (예: '.jpg', '.png')
 * @returns 영어 파일명
 */
export function generateEnglishFilename(extension: string = '.jpg'): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8); // 6자리 랜덤 문자
  return `image_${timestamp}_${randomString}${extension}`;
}

/**
 * 파일 객체에서 확장자 추출
 * @param file File 객체
 * @returns 확장자 (점 포함)
 */
export function getFileExtension(file: File): string {
  const filename = file.name;
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '.jpg';
}

/**
 * File 객체의 파일명을 영어로 변경
 * @param file 원본 File 객체
 * @returns 영어 파일명으로 변경된 File 객체
 */
export function convertFileToEnglishName(file: File): File {
  const extension = getFileExtension(file);
  const newFilename = generateEnglishFilename(extension);
  
  return new File([file], newFilename, {
    type: file.type,
    lastModified: file.lastModified,
  });
}