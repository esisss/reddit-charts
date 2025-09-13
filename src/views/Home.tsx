import { Search } from "../containers/Search";

const Home = () => {
  return (
    <div className="bg-[#e0dcd0] dark:bg-gray-900 flex flex-col justify-center items-center gap-6 text-black dark:text-white h-[100svh] w-[100vw] p-4">
      <h1 className="text-2xl font-bold">Search your favorite subreddit</h1>

      <Search />
    </div>
  );
};

export default Home;
