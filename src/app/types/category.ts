export interface Category {
  categoryId: number; // 카테고리ID
  categoryName: string; // 카테고리명
  permalink: string; // 퍼머링크
  priority: number; // 출력순위
}

export interface AddCategoryRequest {
  title: string; // 카테고리명
  permalink: string; // 퍼머링크
  priority: string; // 출력순위
}
