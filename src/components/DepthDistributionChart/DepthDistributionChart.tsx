import { Doughnut } from "react-chartjs-2";
import type { CommentData } from "../../types/reddit";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Card, Text } from "@radix-ui/themes";
import { countCommentDepths } from "../../utils/countCommentDepths";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const DepthDistributionChart = ({
  comments = [],
}: {
  comments: CommentData[];
}) => {
  const depthCounts = countCommentDepths(comments);
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
  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const percentage = (
              (Number(ctx.raw) / depthCounts.reduce((a, b) => a + b, 0)) *
              100
            ).toFixed(1);
            return `${ctx.label}: ${Number(ctx.raw).toLocaleString("en-US")} (${percentage}%)`;
          },
        },
      },
    },
  };
  return (
    <Card className="w-full max-w-2xl">
      <div className="w-full  ">
        {comments.length === 0 ? (
          <div className="h-64 w-full flex flex-col items-center justify-center">
            <img
              className="w-16 h-16 my-5"
              src="/reddit-negative.png"
              alt="reddit"
            />
            <p className="text-gray-500">This comment thread is empty</p>
          </div>
        ) : (
          <div>
            <div>
              <Text as="div" size="2" color="gray" className="mb-1">
                Top-Level Comments Depth Distribution
              </Text>
            </div>
            <div className="h-64 md:h-80 w-full max-w-2xl mx-auto">
              <Doughnut options={options} data={data} />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Total comments: {depthCounts.reduce((a, b) => a + b, 0)}</p>
              <div className="flex flex-col md:flex-row wrap-break-word gap-2">
                {depthCounts.map((count, index) => (
                  <p key={index}>
                    {index} Level of depth: {count} (
                    {(
                      (count / depthCounts.reduce((a, b) => a + b, 0)) *
                      100
                    ).toFixed(2)}
                    %)
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
