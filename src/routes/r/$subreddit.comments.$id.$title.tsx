import { createFileRoute } from "@tanstack/react-router";
import { Search } from "../../containers/Search";
import { Post } from "../../components/Post/Post";

export const Route = createFileRoute("/r/$subreddit/comments/$id/$title")({
  component: RouteComponent,
  loader: async ({
    context: { queryClient },
    params: { subreddit, id, title },
  }) => {
    const fetchAllComments = async (linkId: string) => {
      let allComments: any[] = [];
      let after = "";
      let hasMore = true;
      const MAX_ATTEMPTS = 10;
      let attempts = 0;
      let totalCommentsFromReddit = 0;

      // First, get the post to get the actual comment count
      const postRes = await fetch(
        `https://www.reddit.com/r/${subreddit}/comments/${id}.json?limit=1`,
      );
      const postData = await postRes.json();
      totalCommentsFromReddit =
        postData[0]?.data?.children[0]?.data?.num_comments || 0;
      console.log(`Reddit reports ${totalCommentsFromReddit} total comments`);

      // Get all top-level comments
      while (hasMore && attempts < MAX_ATTEMPTS) {
        attempts++;
        const url = `https://www.reddit.com/r/${subreddit}/comments/${id}.json?limit=100${after ? `&after=${after}` : ""}&raw_json=1&threaded=false`;
        const res = await fetch(url);
        const data = await res.json();

        if (data && data[1]?.data?.children) {
          const newComments = data[1].data.children;
          console.log(`Fetched ${newComments.length} top-level comments`);
          allComments = [...allComments, ...newComments];

          after = data[1].data.after;
          hasMore = !!after && newComments.length > 0;
        } else {
          hasMore = false;
        }
      }

      // Process 'more comments' placeholders
      const processMoreComments = async (
        commentIds: string[],
        parentId: string,
      ) => {
        if (commentIds.length === 0) return [];

        console.log(
          `Fetching ${commentIds.length} more comments for parent ${parentId}`,
        );
        const moreUrl = `https://www.reddit.com/api/morechildren.json?api_type=json&link_id=t3_${id}&children=${commentIds.join(",")}&raw_json=1`;
        try {
          const moreRes = await fetch(moreUrl);
          const moreData = await moreRes.json();
          return moreData?.json?.data?.things || [];
        } catch (error) {
          console.error("Error fetching more comments:", error);
          return [];
        }
      };

      // Recursively process comments and their replies
      const processCommentTree = async (comment: any): Promise<any[]> => {
        if (!comment || !comment.data) return [];

        const result = [comment];

        // Process replies if they exist
        if (comment.data.replies?.data?.children) {
          const replies = comment.data.replies.data.children;
          const moreReplies = replies.filter(
            (r: any) => r.kind === "more" && r.data?.children?.length > 0,
          );

          // Process regular replies
          for (const reply of replies) {
            if (reply.kind === "t1") {
              const nestedReplies = await processCommentTree(reply);
              result.push(...nestedReplies);
            }
          }

          // Process 'more comments' placeholders
          for (const more of moreReplies) {
            const moreComments = await processMoreComments(
              more.data.children,
              more.data.parent_id,
            );
            for (const newComment of moreComments) {
              const nestedReplies = await processCommentTree(newComment);
              result.push(...nestedReplies);
            }
          }
        }

        return result;
      };

      // Process all top-level comments
      console.log(`Processing ${allComments.length} top-level comments...`);
      const processedComments: any[] = [];

      for (const comment of allComments) {
        if (comment.kind === "t1") {
          const commentTree = await processCommentTree(comment);
          processedComments.push(...commentTree);
        } else if (comment.kind === "more" && comment.data?.children) {
          const moreComments = await processMoreComments(
            comment.data.children,
            comment.data.parent_id,
          );
          for (const newComment of moreComments) {
            const commentTree = await processCommentTree(newComment);
            processedComments.push(...commentTree);
          }
        }
      }

      // Log statistics
      const uniqueCommentIds = new Set(processedComments.map((c) => c.data.id));
      console.log({
        totalCommentsFromReddit,
        processedComments: processedComments.length,
        uniqueCommentIds: uniqueCommentIds.size,
        topLevelComments: allComments.filter((c) => c.kind === "t1").length,
        moreComments: allComments.filter((c) => c.kind === "more").length,
      });

      return processedComments;
    };

    const data = await queryClient.fetchQuery({
      queryKey: ["subreddit", subreddit, "comments", id, title],
      queryFn: async () => {
        const res = await fetch(
          `https://www.reddit.com/r/${subreddit}/comments/${id}.json?limit=100&raw_json=1`,
        );
        const data = await res.json();

        // Always try to fetch all comments in the background
        fetchAllComments(id)
          .then((comments) => {
            console.log(`Fetched ${comments.length} comments in total`);
            queryClient.setQueryData(
              ["subreddit", subreddit, "comments", id, title],
              [data[0], { data: { children: comments } }],
            );
          })
          .catch((error) => {
            console.error("Error fetching all comments:", error);
          });

        return data;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return data;
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const post = data[0]?.data.children;
  const comments = data[1]?.data.children;
  return (
    <div className="min-h-[100svh] bg-gray-900 text-white w-screen ">
      <div className="w-screen p-3 flex flex-col justify-center items-center gap-6">
        <Search />
        <Post post={post[0]} comments={comments} />
      </div>
    </div>
  );
}
