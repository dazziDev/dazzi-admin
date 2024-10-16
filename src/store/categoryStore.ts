import { Category } from "@/app/types/category";
import { create } from "zustand";

interface CategoryStore {
  categoryList: Category[]; // 받은 리스트 (categoryId 포함)
  setCategoryList: (categories: Category[]) => void;
  addCategory: (category: Category) => void; // categoryId가 포함된 데이터 저장
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categoryList: [],
  setCategoryList: (categories) => set({ categoryList: categories }),
  addCategory: (category) =>
    set((state) => ({ categoryList: [...state.categoryList, category] })), // Category만 추가 가능
}));
