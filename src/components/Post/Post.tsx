import { AvatarIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { EarlyCommentsActivityChart } from "../EarlyCommentsActivityChart/EarlyCommentsActivityChart";
import timeAgo from "../../utils/timeAgo";
import type { PostData, CommentData } from "../../types/reddit";

export const Post = ({
  post,
  comments,
}: {
  post: PostData;
  comments: CommentData[];
}) => {
  return (
    <div className="my-0 w-full max-w-2xl">
      <Card>
        <Flex direction="column" gap="4">
          <Flex direction="row" justify="between" align="start">
            <Flex
              gap="2"
              className="w-full"
              direction="column"
              justify="between"
              align="start"
            >
              <div className="w-full flex flex-row justify-start items-center gap-2">
                <AvatarIcon className="w-5 h-5" />
                <Text as="div" size="1" color="gray">
                  u/{post?.author} • {timeAgo(post?.created_utc)}
                </Text>
              </div>
              <Heading size="5">{post?.title}</Heading>
            </Flex>
            <a href={post?.url} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon color="#9CA4CA" className="w-5 h-5" />
            </a>
          </Flex>

          <EarlyCommentsActivityChart comments={comments} post={post} />
        </Flex>
      </Card>
    </div>
  );
};
