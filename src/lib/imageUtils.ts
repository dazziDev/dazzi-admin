/**
 * S3画像URLの処理ユーティリティ
 */

// S3画像が読み込めない場合のフォールバック処理
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  const img = event.currentTarget;
  
  // 既にフォールバック済みの場合は無限ループを防ぐ
  if (img.dataset.fallback === 'true') {
    return;
  }
  
  // フォールバック画像を設定
  img.dataset.fallback = 'true';
  img.src = '/images/placeholder.svg'; // プレースホルダー画像
  img.alt = '이미지를 불러올 수 없습니다';
};

// S3 URLが有効かチェック
export const isValidS3Url = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('amazonaws.com');
  } catch {
    return false;
  }
};

// S3画像のプリロード
export const preloadS3Image = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

// CORS対応のための画像コンポーネント用プロパティ
export const getCorsImageProps = (src: string) => ({
  src,
  crossOrigin: 'anonymous' as const,
  referrerPolicy: 'no-referrer' as const,
});