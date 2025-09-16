import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
import * as z from "zod";

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
  const { subreddit, sort = "hot" } = useParams({
    strict: true,
    from: "/r/$subreddit/$sort",
  });
  console.log(Route.useParams());
  return (
    <div>
      {subreddit}, {sort}
    </div>
  );
}
