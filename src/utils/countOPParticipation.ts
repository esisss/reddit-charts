import type { CommentData } from "../types/reddit";

export interface OPParticipation {
  opComments: number;
  otherComments: number;
  totalComments: number;
  opPercentage: number;
  otherPercentage: number;
}

export const countOPParticipation = (
  comments: CommentData[],
  opName: string,
): OPParticipation => {
  let opComments = 0;
  let totalComments = 0;

  const processComment = (comment: CommentData) => {
    totalComments++;

    // Check if the comment is from the OP
    if (comment.data.author === opName) {
      opComments++;
    }

    // Recursively process replies
    const replies = comment.data.replies;
    if (replies && typeof replies !== "string" && replies.data?.children) {
      replies.data.children.forEach((reply) => {
        if (reply.kind === "t1") {
          processComment(reply);
        }
      });
    }
  };

  // Process all top-level comments
  comments.forEach((comment) => {
    if (comment.kind === "t1") {
      processComment(comment);
    }
  });

  const otherComments = totalComments - opComments;
  const opPercentage =
    totalComments > 0 ? (opComments / totalComments) * 100 : 0;
  const otherPercentage = totalComments > 0 ? 100 - opPercentage : 0;

  return {
    opComments,
    otherComments,
    totalComments,
    opPercentage,
    otherPercentage,
  };
};
