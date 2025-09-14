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
      <div className="flex flex-col items-center gap-2">
        <SearchBar />

        <div className="w-full mt-2 flex items-center justify-center min-h-[42px]">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full md:max-w-[616px]">
            <div
              className={`transition-opacity duration-300 w-full max-w-[300px] ${
                !dropdownOpen && searchCategory !== "u/"
                  ? "opacity-100"
                  : "opacity-0 hidden"
              }`}
            >
              <PostSortingFilter
                value={searchSortBy}
                onValueChange={(value) => setSearchSortBy(value)}
              />
            </div>
            <div
              className={`transition-opacity duration-300 w-full max-w-[300px] ${
                !dropdownOpen && searchInputValue
                  ? "opacity-100"
                  : "opacity-0 hidden"
              }`}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center bg-[#ff4400] hover:bg-[#ff4000] text-white font-medium py-2 px-4 rounded-full transition-colors cursor-pointer active:bg-[#ff5e00] animate-fade-in motion-reduce-animate-none relative"
                disabled={!searchInputValue?.trim()}
              >
                <div className="absolute left-4">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </div>
                <span className="pl-6 pr-4 overflow-hidden text-ellipsis whitespace-nowrap">
                  {searchCategory}
                  {searchInputValue?.trim()}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
