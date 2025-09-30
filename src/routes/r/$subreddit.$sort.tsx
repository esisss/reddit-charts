import { createFileRoute, redirect } from "@tanstack/react-router";
import * as z from "zod";
import { Search } from "../../containers/Search";
import { FeedPost, type PostData } from "../../components/FeedPost/FeedPost";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Error } from "../../components/Error/Error";
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
  loader: ({ context: { queryClient }, params: { subreddit, sort } }) => {
    const data = queryClient.ensureQueryData({
      queryKey: ["subreddit", subreddit, sort],
      queryFn: async () => {
        try {
          const res = await fetch(
            `https://www.reddit.com/r/${subreddit}/${sort}.json?limit=50`,
          );
          return res.json();
        } catch {
          throw new Error("Failed to fetch data");
        }
      },
    });
    return data;
  },
  errorComponent: () => {
    return <Error />;
  },
});

function RouteComponent() {
  const posts = Route.useLoaderData();
  return (
    <div className="min-h-[100svh] bg-gray-900 text-white w-screen ">
      <div className="w-screen p-3 flex flex-col justify-center items-center gap-6">
        <Search />

        {posts?.data.children.map((post: PostData) => (
          <FeedPost post={post} key={post.data.id} />
        ))}
      </div>
    </div>
  );
}
