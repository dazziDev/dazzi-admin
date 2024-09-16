import { AddCategoryRequest, Category } from "@/store/category";
import axiosInstance from "./axiosInstance";

export interface Article {
  id: number;
  title: string;
  subtitle: string;
  permalink: string;
  isMain: boolean;
}

// 카테고리의 해당되는 기사 리스트를 취득하는 API
// GET : axiosInstance /article/{category_permalink}/list
export const fetchArticlesByCategory = async (
  categoryPermalink: string
): Promise<Article[]> => {
  const response = await axiosInstance.get(
    `/article/${categoryPermalink}/list`
  );
  return response.data;
};

export const fetchCategories = async (): Promise<Category[]> => {
  return initialCategories;
  // const response = await axiosInstance.get("/categories/list");
  // return response.data;
};

// 여기 카테고리 더미데이터 만들어줘
const initialCategories: Category[] = [
  {
    id: 1,
    label: "여행",
    permalink: "travel",
  },
  {
    id: 2,
    label: "음식",
    permalink: "food",
  },
  {
    id: 3,
    label: "일상",
    permalink: "daily",
  },
  {
    id: 4,
    label: "거리인터뷰",
    permalink: "street",
  },
  {
    id: 5,
    label: "패션",
    permalink: "fashion",
  },
];

export const addCategory = async (
  categories: AddCategoryRequest
): Promise<AddCategoryRequest> => {
  const response = await axiosInstance.post("/categories/add", categories);
  return response.data;
};

export const updateCategory = async (
  categories: Category
): Promise<Category> => {
  const response = await axiosInstance.put(
    `/categories/${categories.id}`,
    categories
  );
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
};
