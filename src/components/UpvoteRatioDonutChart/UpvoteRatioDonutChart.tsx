import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { estimateVotes } from "../../utils/upvotes";
import { Card, Text } from "@radix-ui/themes";

ChartJS.register(ArcElement, Tooltip, Legend);

export const UpvoteRatioDonutChart = ({
  score,
  upvoteRatio,
}: {
  score: number;
  upvoteRatio: number;
}) => {
  const { upvotes, downvotes } = estimateVotes(score, upvoteRatio);

  const data = {
    labels: [
      `Upvotes (estimated${score === 0 ? " percentual" : ""})`,
      `Downvotes (estimated${score === 0 ? " percentual" : ""})`,
    ],
    datasets: [
      {
        data:
          score === 0
            ? [upvoteRatio * 100, 100 - upvoteRatio * 100]
            : [upvotes, downvotes],
        backgroundColor: ["#9CA4CAAC", "#F43F5D9C"],
        borderWidth: 1,
        borderColor: ["#9CA4CA", "#F43F5D"],
        hoverBackgroundColor: ["#9CA4CA", "#f43f5e"],
      },
    ],
  };

  return (
    <Card className="w-full max-w-2xl">
      <div className="w-full h-full">
        <div>
          <Text as="div" size="2" color="gray" className="mb-1">
            Upvote Ratio
          </Text>
        </div>
        <div className="w-full max-w-2xl mx-auto h-[23rem]">
          <Doughnut
            options={{
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (ctx) => {
                      if (score === 0) {
                        return `${ctx.label}: ${Number(ctx.raw).toLocaleString(
                          "en-US",
                        )}%`;
                      }
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

        {score === 0 && (
          <p
            className="text-center py-5"
            style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}
          >
            Note: With score 0, it is not possible to infer unique
            Upvotes/Downvotes. They are shown with its percentual representation
            of the upvote ratio.
          </p>
        )}
      </div>
    </Card>
  );
};
