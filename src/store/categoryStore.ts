import { Category } from "@/app/types/category";
import { create } from "zustand";

interface CategoryStore {
  categoryList: Category[];
  setCategoryList: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categoryList: [],
  setCategoryList: (categories) => set({ categoryList: categories }),
  addCategory: (category) =>
    set((state) => ({ categoryList: [...state.categoryList, category] })),
}));
