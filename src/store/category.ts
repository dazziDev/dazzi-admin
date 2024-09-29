export interface Category {
  id: number;
  label: string;
  permalink: string;
}

export interface AddCategoryRequest {
  label: string;
  permalink: string;
}
