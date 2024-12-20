import https from "https";
import { AddCategoryRequest, Category } from "../types/category";
import axiosInstance from "./axiosInstance";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

// 카테고리 리스트 가져오기
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get("category/list", {
      httpsAgent: agent,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// 카테고리 추가하기
export const addCategory = async (
  category: AddCategoryRequest
): Promise<Category> => {
  const response = await axiosInstance.post("/category/add", category);
  return response.data;
};

// // 카테고리 업데이트
// export const updateCategory = async (
//   category: Category
// ): Promise<Category> => {
//   const response = await axiosInstance.put(
//     `/category/${category.id}`,
//     category
//   );
//   return response.data;
// };

// // 카테고리 삭제
// export const deleteCategory = async (id: number): Promise<void> => {
//   await axiosInstance.delete(`/category/${id}`);
// };
