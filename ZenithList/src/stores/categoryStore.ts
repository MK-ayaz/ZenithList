import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "../types";

interface CategoryState {
  categories: Category[];
  addCategory: (input: CreateCategoryInput) => Category;
  updateCategory: (id: string, input: UpdateCategoryInput) => void;
  deleteCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],

      addCategory: (input) => {
        const category: Category = {
          ...input,
          id: crypto.randomUUID(),
        };
        set((state) => ({ categories: [...state.categories, category] }));
        return category;
      },

      updateCategory: (id, input) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...input } : c
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },
    }),
    {
      name: "zenithlist-categories",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
