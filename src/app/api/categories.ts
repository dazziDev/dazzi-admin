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
  const response = await axiosInstance.get("/categories/list");
  return response.data;
};

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
