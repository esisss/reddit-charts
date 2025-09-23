import { createFileRoute } from "@tanstack/react-router";
import { Search } from "../../containers/Search";
import { Post } from "../../components/Post/Post";

export const Route = createFileRoute("/r/$subreddit/comments/$id/$title")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { subreddit, id, title } }) => {
    const data = queryClient.ensureQueryData({
      queryKey: ["subreddit", subreddit, "comments", id, title],
      queryFn: async () => {
        const res = await fetch(
          `https://www.reddit.com/r/${subreddit}/comments/${id}/${title}.json`,
        );
        return res.json();
      },
    });
    return data;
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const post = data[0]?.data.children;
  const comments = data[1]?.data.children;
  console.log(post);

  return (
    <div className="min-h-[100svh] bg-gray-900 text-white w-screen ">
      <div className="w-screen p-3 flex flex-col justify-center items-center gap-6">
        <Search />
        <Post post={post[0]} comments={comments} />
      </div>
    </div>
  );
}
