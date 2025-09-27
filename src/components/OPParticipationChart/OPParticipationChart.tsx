import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { countOPParticipation } from "../../utils/countOPParticipation";
import type { CommentData, PostData } from "../../types/reddit";
import { Card, Text } from "@radix-ui/themes";

ChartJS.register(ArcElement, Tooltip, Legend);

interface OPParticipationChartProps {
  comments: CommentData[];
  post: PostData;
}

export const OPParticipationChart = ({
  comments,
  post,
}: OPParticipationChartProps) => {
  const participation = countOPParticipation(comments, post.author);

  const data = {
    labels: ["OP's Comments", "Other Comments"],
    datasets: [
      {
        data: [participation.opComments, participation.otherComments],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
        borderWidth: 1,
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
          label: function (context) {
            const label = context.label || "";
            const value = context.raw as number;
            const percentage = (
              (value / participation.totalComments) *
              100
            ).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Card className="w-full max-w-2xl p-4">
      <Text color="gray" size="2" className="mb-4">
        Comment Participation
      </Text>
      <div className="h-64 md:h-80">
        <Doughnut data={data} options={options} />
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <p>
          Total comments: {participation.totalComments} (Include nested threads)
        </p>
        <p>
          OP's comments: {participation.opComments} (
          {participation.opPercentage.toFixed(1)}%)
        </p>
        <p>
          Other comments: {participation.otherComments} (
          {participation.otherPercentage.toFixed(1)}%)
        </p>
      </div>
    </Card>
  );
};
