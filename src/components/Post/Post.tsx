import { AvatarIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";
import timeAgo from "../../utils/timeAgo";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler,
);

export const Post = ({ post, comments }) => {
  return (
    <div className="my-0 w-full">
      <Card>
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
                u/{post?.data?.author} • {timeAgo(post?.data?.created_utc)}
              </Text>
            </div>
            <Heading size="5">{post?.data?.title}</Heading>
          </Flex>
          <a href={post?.data?.url} target="_blank">
            <ExternalLinkIcon color="#9CA4CA" className="w-5 h-5 " />
          </a>
        </Flex>
      </Card>
    </div>
  );
};
