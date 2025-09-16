import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
import * as z from "zod";
import { SearchBar } from "../../components/SearchBar";
import { Search } from "../../containers/Search";

const subredditSchema = z.string().min(1);
const sortSchema = z.enum(["hot", "new", "top", "rising", "best"]);

export const Route = createFileRoute("/r/$subreddit/$sort")({
  component: RouteComponent,
  params: {
    parse: (raw) => {
      return {
        subreddit: subredditSchema.parse(raw.subreddit),
        sort: sortSchema.parse(raw.sort),
      };
    },
  },
  beforeLoad: ({ params }) => {
    const sort = sortSchema.safeParse(params.sort.trim().toLowerCase()).success;
    if (!sort) {
      throw redirect({
        to: `/r/${params.subreddit}/hot`,
        replace: true,
      });
    }
  },
  errorComponent: () => {
    return <div>Invalid subreddit or sort option</div>;
  },
});

function RouteComponent() {
  const { subreddit, sort } = useParams({
    strict: true,
    from: "/r/$subreddit/$sort",
  });
  const { isPending, error, data } = useQuery({
    queryKey: ["subreddit", subreddit, sort],
    queryFn: async () => {
      const res = await fetch(
        `https://www.reddit.com/r/${subreddit}/${sort}.json`,
      );
      return res.json();
    },
  });
  return (
    <div className="min-h-[100svh] w-screen ">
      {isPending ? (
        "Loading..."
      ) : (
        <div className="w-screen p-3 flex flex-col justify-center items-center gap-2">
          <Search />

          {data?.data.children.map((post) => (
            <div key={post.data.id}>{post.data.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
