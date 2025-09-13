import { PostSortingFilter } from "../components/PostSortingFilter/PostSortingFilter";
import { SearchBar } from "../components/SearchBar";
import { useState } from "react";

type SortOption = "hot" | "new" | "top" | "rising" | "best";
type CategoryOption = "r/" | "u/";

export const Search = () => {
  const [sortBy, setSortBy] = useState<SortOption>("hot");
  const [subreddit, setSubreddit] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<CategoryOption>("r/");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality with the selected sort option
    console.log(`Searching r/${subreddit} sorted by: ${sortBy}`);
  };
  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl space-y-4">
      <SearchBar
        value={subreddit}
        onChange={(e) => setSubreddit(e.target.value)}
        handleSetOpen={setOpen}
        open={open}
        category={category}
        handleSetCategory={setCategory}
      />

      <div className="flex flex-col items-center gap-2">
        {!open && (
          <PostSortingFilter
            value={sortBy}
            onValueChange={(value) => setSortBy(value)}
          />
        )}
      </div>

      <button
        type="submit"
        className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-full transition-colors"
        disabled={!subreddit.trim()}
      >
        Search r/{subreddit || "..."}
      </button>
    </form>
  );
};
