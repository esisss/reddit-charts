import type { CommentData } from "../types/reddit";

export interface AuthorScore {
  author: string;
  totalScore: number;
  commentCount: number;
  averageScore: number;
}

export const getTopAuthorsByScore = (
  comments: CommentData[],
  limit: number = 10,
): AuthorScore[] => {
  const authorMap = new Map<
    string,
    { totalScore: number; commentCount: number }
  >();

  // recursive function to process all comments and replies
  const processComment = (comment: CommentData) => {
    const author = comment.data.author;
    if (author === "[deleted]" || author === "") return;

    const score = comment.data.score || 0;
    const current = authorMap.get(author) || { totalScore: 0, commentCount: 0 };

    authorMap.set(author, {
      totalScore: current.totalScore + score,
      commentCount: current.commentCount + 1,
    });

    // process replies if they exist
    const replies = comment.data.replies;
    if (replies && typeof replies !== "string" && replies.data?.children) {
      replies.data.children.forEach((reply) => {
        if (reply.kind === "t1") {
          processComment(reply);
        }
      });
    }
  };

  // process all top-level comments
  comments.forEach((comment) => {
    if (comment.kind === "t1") {
      processComment(comment);
    }
  });

  // convert to array, calculate averages, and sort by total score
  return Array.from(authorMap.entries())
    .map(([author, { totalScore, commentCount }]) => ({
      author,
      totalScore,
      commentCount,
      averageScore: commentCount > 0 ? totalScore / commentCount : 0,
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit);
};
