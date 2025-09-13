import { SearchCategoryDropdown } from "./SearchCategoryDropdown/SearchCategoryDropdown";
import { useSearchStore } from "../context/useSearchStore";

export const SearchBar = () => {
  const { searchInputValue, setSearchInputValue } = useSearchStore();

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full h-12 rounded-full border-2 flex flex-row border-[#ff4400] overflow-hidden">
        <SearchCategoryDropdown />
        <input
          type="text"
          placeholder="Search"
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          className="w-full px-1 active:outline-none focus:outline-none bg-transparent border-none"
        />
      </div>
    </div>
  );
};
