import { create } from "zustand";

type SearchCategory = "r/" | "u/";
type SortOption = "hot" | "new" | "top" | "rising" | "best";

interface SearchStore {
  searchInputValue: string;
  setSearchInputValue: (value: string) => void;
  searchCategory: SearchCategory;
  setSearchCategory: (value: SearchCategory) => void;
  searchSortBy: SortOption;
  setSearchSortBy: (value: SortOption) => void;
  searchOpen: boolean;
  setSearchOpen: (value: boolean) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchInputValue: "",
  setSearchInputValue: (value) => set({ searchInputValue: value }),
  searchCategory: "r/",
  setSearchCategory: (value) => set({ searchCategory: value }),
  searchSortBy: "hot",
  setSearchSortBy: (value) => set({ searchSortBy: value }),
  searchOpen: false,
  setSearchOpen: (value) => set({ searchOpen: value }),
}));
