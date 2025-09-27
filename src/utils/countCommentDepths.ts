import type { CommentData } from "../types/reddit";

export const countCommentDepths = (comments: CommentData[]): number[] => {
  //initialize an array to hold counts for depths 0-5+
  const depthCounts = [0, 0, 0, 0, 0, 0];

  const processComment = (comment: CommentData, depth: number = 0) => {
    //cap depth at 5+ for the chart
    const depthIndex = Math.min(depth, 5);
    //recursively process replies
    const replies = comment.data.replies;
    if (replies && typeof replies !== "string" && replies.data?.children) {
      replies.data.children.forEach((reply) => {
        if (reply.kind === "t1") {
          //t1 is the kind for comments
          processComment(reply, depth + 1);
        }
      });
    } else {
      depthCounts[depthIndex]++;
    }
  };

  //process all top-level comments
  comments.forEach((comment) => {
    if (comment.kind === "t1") {
      processComment(comment, 0);
    }
  });
  return depthCounts;
};
