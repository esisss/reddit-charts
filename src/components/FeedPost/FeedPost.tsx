import React from "react";
import { Badge, Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import timeAgo from "../../utils/timeAgo";
import {
  AvatarIcon,
  ChatBubbleIcon,
  ExternalLinkIcon,
  HeartIcon,
  PieChartIcon,
  ThickArrowUpIcon,
} from "@radix-ui/react-icons";

export const FeedPost = ({ post }) => {
  return (
    <Box maxWidth="42rem" width="100%">
      <Card>
        <Flex gap="3" align="start" direction="column">
          <Flex gap="2" className="w-full" justify="between" align="center">
            <div className="flex items-center gap-2">
              <AvatarIcon className="w-5 h-5" />
              <Text as="div" size="1" color="gray">
                u/{post.data.author} • {timeAgo(post.data.created_utc)}
              </Text>
            </div>
            <a
              target="_blank"
              href={"https://reddit.com" + post.data.permalink}
            >
              <ExternalLinkIcon color="#9CA4CA" className="w-4 h-4" />
            </a>
          </Flex>
          <Heading size="4" weight="bold">
            {post.data.title}
          </Heading>
          <div className="flex items-center gap-2">
            {post.data.link_flair_text && (
              <Badge color="gray">{post.data.link_flair_text}</Badge>
            )}
            {post.data.over_18 && <Badge color="crimson">NSFW</Badge>}
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center w-full gap-4 text-sm">
              <span>
                <ThickArrowUpIcon color="#9CA4CA" className="w-5 h-5 inline" />{" "}
                {post.data.score}
              </span>
              <span>
                <ChatBubbleIcon color="#9CA4CA" className="w-4 h-4 inline" />{" "}
                {post.data.num_comments}
              </span>
              {typeof post.data.upvote_ratio === "number" && (
                <span>
                  <HeartIcon color="#9CA4CA" className="w-4 h-4 inline" />{" "}
                  {Math.round(post.data.upvote_ratio * 100)}%
                </span>
              )}
            </div>
            <button className="w-[140px] p-1 flex items-center justify-center gap-1 rounded-lg bg-gray-900 border-[1px] border-[#8080805C]">
              <PieChartIcon className="w-4 h-4 inline" />{" "}
              <span className="text-sm">View Stats</span>
            </button>
          </div>
        </Flex>
      </Card>
    </Box>
  );
};
