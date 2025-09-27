import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Card, Text } from "@radix-ui/themes";
import { getTopAuthorsByScore } from "../../utils/getTopAuthorsByScore";
import type { CommentData } from "../../types/reddit";

// register chartjs components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface TopAuthorsByScoreChartProps {
  comments: CommentData[];
  limit?: number;
}

export const TopAuthorsByScoreChart = ({
  comments,
  limit = 10,
}: TopAuthorsByScoreChartProps) => {
  // get top authors by score
  const topAuthors = getTopAuthorsByScore(comments, limit);

  // prepare chart data
  const data = {
    labels: topAuthors.map((author) => author.author),
    datasets: [
      {
        label: "Total Score",
        data: topAuthors.map((author) => author.totalScore),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Average Score",
        data: topAuthors.map((author) => author.averageScore),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        type: "line" as const,
        yAxisID: "y1",
      },
    ],
  };

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          afterBody: (context) => {
            const index = context[0].dataIndex;
            const author = topAuthors[index];
            return [
              `Comments: ${author.commentCount}`,
              `Avg. Score: ${author.averageScore.toFixed(1)}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Total Score",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Average Score",
        },
      },
    },
  };

  return (
    <Card className="w-full max-w-2xl p-4">
      <Text as="div" size="2" color="gray" className="mb-4">
        Top Authors by Score
      </Text>
      <div className="h-96 w-full">
        {topAuthors.length > 0 ? (
          <Chart type="bar" data={data} options={options} />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-500">
            no comments available
          </div>
        )}
      </div>
    </Card>
  );
};
