import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { PostSortingFilter } from "../components/PostSortingFilter";

type SortOption = "hot" | "new" | "top" | "rising" | "best";

const Home = () => {
  const [sortBy, setSortBy] = useState<SortOption>("hot");
  const [subreddit, setSubreddit] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality with the selected sort option
    console.log(`Searching r/${subreddit} sorted by: ${sortBy}`);
  };

  return (
    <div className="bg-[#e0dcd0] dark:bg-gray-900 flex flex-col justify-center items-center gap-6 text-black dark:text-white h-[100svh] w-[100vw] p-4">
      <h1 className="text-2xl font-bold">Search your favorite subreddit</h1>

      <form onSubmit={handleSearch} className="w-full max-w-2xl space-y-4">
        <SearchBar
          value={subreddit}
          onChange={(e) => setSubreddit(e.target.value)}
        />

        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Sort by:
          </span>
          <PostSortingFilter
            value={sortBy}
            onValueChange={(value) => setSortBy(value)}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-full transition-colors"
          disabled={!subreddit.trim()}
        >
          Search r/{subreddit || "..."}
        </button>
      </form>
    </div>
  );
};

export default Home;
