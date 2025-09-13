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
  useSearchStore();
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
      </div>

      <button
        type="submit"
        className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-full transition-colors"
        disabled={!searchInputValue.trim()}
      >
        Search r/{searchInputValue || "..."}
      </button>
    </form>
  );
};
