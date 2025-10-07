import { createFileRoute, redirect } from "@tanstack/react-router";
import * as z from "zod";
import { Search } from "../../containers/Search";
import { FeedPost, type PostData } from "../../components/FeedPost/FeedPost";
import { Error as ErrorComponent } from "../../components/Error/Error";
import { Loading } from "../../components/Loading/Loading";
import { useEffect, useState } from "react";
import { useInView } from "../../hooks/useInView";
import { useInfiniteQuery } from "@tanstack/react-query";
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
        } catch (error: unknown) {
          console.error(error);
          throw new Error("Failed to fetch data");
        }
      },
    });
    return data;
  },
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  const posts = Route.useLoaderData();
  const { subreddit, sort } = Route.useParams();
  const [infiniteRef, inView] = useInView({ threshold: 1 });
  const { fetchNextPage, hasNextPage, isFetchingNextPage, ...result } =
    useInfiniteQuery({
      queryKey: ["posts", subreddit, sort],
      queryFn: async ({ pageParam = "" }: { pageParam: string }) => {
        const res = await fetch(
          `https://www.reddit.com/r/${subreddit}/${sort}.json?after=${pageParam}&limit=25`,
        );
        return res.json();
      },
      initialData: {
        pages: [posts],
        pageParams: [""],
      },
      getNextPageParam: (lastPage) => lastPage.data.after || undefined,
      initialPageParam: "",
    });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <div className="min-h-[100svh] bg-gray-900 text-white w-screen ">
      <div className="w-screen p-3 flex flex-col justify-center items-center gap-6">
        <Search />
        {result.data?.pages
          .flatMap((page) => page.data.children)
          .map((post: PostData) => (
            <FeedPost post={post} key={post.data.id} />
          ))}
        <div ref={infiniteRef} className={` ${hasNextPage ? "" : "hidden"}`}>
          <Loading active={isFetchingNextPage} />
        </div>
      </div>
    </div>
  );
}
