import { Doughnut } from "react-chartjs-2";
import type { CommentData } from "../../types/reddit";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Text } from "@radix-ui/themes";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const countCommentDepths = (comments: CommentData[]): number[] => {
  // Initialize an array to hold counts for depths 0-5+
  const depthCounts = [0, 0, 0, 0, 0, 0];

  const processComment = (comment: CommentData, depth: number = 0) => {
    // Cap depth at 5+ for the chart
    const depthIndex = Math.min(depth, 5);
    // Recursively process replies
    const replies = comment.data.replies;
    if (replies && typeof replies !== "string" && replies.data?.children) {
      replies.data.children.forEach((reply) => {
        if (reply.kind === "t1") {
          // t1 is the kind for comments
          processComment(reply, depth + 1);
        }
      });
    } else {
      depthCounts[depthIndex]++;
    }
  };

  // Process all top-level comments
  comments.forEach((comment) => {
    if (comment.kind === "t1") {
      processComment(comment, 0);
    }
  });
  return depthCounts;
};

export const DepthDistributionChart = ({
  comments = [],
}: {
  comments: CommentData[];
}) => {
  const depthCounts = countCommentDepths(comments);
  console.log(depthCounts);
  const data = {
    labels: [
      "0 - Depth",
      "1 Level of depth",
      "2 Levels of depth",
      "3 Levels of depth",
      "4 Levels of depth",
      "5+ Levels of depth",
    ],
    datasets: [
      {
        data: depthCounts,
        backgroundColor: [
          "#9CA4CA9D",
          "#F4A03FAA",
          "#9E1DBE80",
          "#51C3429D",
          "#F1F43F9C",
          "#125AC67A",
        ],
        hoverBackgroundColor: [
          "#9CA4CA",
          "#F4A03F",
          "#9E1DBE",
          "#51C342",
          "#F1F43F",
          "#125AC6",
        ],
        borderWidth: 1,
        borderColor: [
          "#9CA4CA",
          "#F4A03F",
          "#9E1DBE",
          "#51C342",
          "#F1F43F",
          "#125AC6",
        ],
      },
    ],
  };

  return (
    <div className="w-full my-10 h-full">
      {comments.length === 0 ? (
        <div className="h-64 w-full flex flex-col items-center justify-center">
          <img className="w-16 h-16 my-5" src="/reddit.webp" alt="reddit" />
          <p className="text-gray-500">This comment thread is empty</p>
        </div>
      ) : (
        <div>
          <div>
            <Text as="div" size="2" color="gray" className="mb-1">
              Top-Level Comments Depth Distribution
            </Text>
          </div>
          <div className="max-w-[75%] mx-auto">
            <Doughnut
              options={{
                responsive: true,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (ctx) => {
                        return `${ctx.label}: ${Number(ctx.raw).toLocaleString(
                          "en-US",
                        )}`;
                      },
                    },
                  },
                },
              }}
              data={data}
            />
          </div>
        </div>
      )}
    </div>
  );
};
