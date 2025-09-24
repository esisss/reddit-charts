export interface PostData {
  id: string;
  title: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
  url: string;
  selftext?: string;
  is_self: boolean;
  thumbnail?: string;
  upvote_ratio?: number;
  preview?: {
    images: Array<{
      source: {
        url: string;
        width: number;
        height: number;
      };
      resolutions: Array<{
        url: string;
        width: number;
        height: number;
      }>;
    }>;
  };
}

export interface CommentData {
  data: {
    parent_id: string;
    id: string;
    author: string;
    body: string;
    score: number;
    created_utc: number;
    replies?:
      | {
          data?: {
            children: Array<{
              kind: string;
              data: CommentData;
            }>;
          };
        }
      | "";
    is_submitter?: boolean;
    depth: number;
  };
}
