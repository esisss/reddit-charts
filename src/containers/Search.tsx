import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { PostSortingFilter } from "../components/PostSortingFilter/PostSortingFilter";
import { SearchBar } from "../components/SearchBar";
import { useSearchStore } from "../context/useSearchStore";

export const Search = () => {
  const {
    dropdownOpen,
    searchInputValue,
    searchCategory,
    searchSortBy,
    setSearchSortBy,
  } = useSearchStore();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality with the selected sort option
    console.log(`Searching r/${searchInputValue} sorted by: ${searchSortBy}`);
  };
  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl space-y-4">
      <SearchBar />

      <div className="flex flex-col items-center gap-2">
        {!dropdownOpen && searchCategory != "u/" && (
          <PostSortingFilter
            value={searchSortBy}
            onValueChange={(value) => setSearchSortBy(value)}
          />
        )}
        {searchInputValue && (
          <button
            type="submit"
            className="w-[285px] flex items-center justify-center mt-4 bg-[#ff4400] hover:bg-[#ff4000] text-white font-medium py-2 px-4 rounded-full transition-colors cursor-pointer active:bg-[#ff5e00] relative"
            disabled={!searchInputValue.trim()}
          >
            <div className="absolute left-4">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </div>
            <span className="max-w-[calc(100%-40px)] ml-2 overflow-hidden text-ellipsis whitespace-nowrap">
              {searchCategory}
              {searchInputValue.trim()}
            </span>
          </button>
        )}
      </div>
    </form>
  );
};
