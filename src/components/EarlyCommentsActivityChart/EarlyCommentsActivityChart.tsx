import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler,
  type TooltipModel,
  type TooltipItem,
} from "chart.js";
import { useMemo, useState } from "react";
import { millisecondsToHours } from "date-fns";
import { Button, Card, Text } from "@radix-ui/themes";
import type { CommentData, PostData } from "../../types/reddit";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler,
);

//presets in hours

const TIME_WINDOWS = [
  { hours: 12, intervals: 6 },
  { hours: 24, intervals: 8 },
  { hours: 48, intervals: 12 },
];

const processCommentData = (
  comments: CommentData[],
  postCreatedUtc: number | undefined,
  hoursToDisplay: number,
  timeIntervals: number,
): {
  labels: string[];
  data: number[];
  totalTopLevelComments: number;
  commentCounts: number[];
} => {
  if (!comments?.length || !postCreatedUtc)
    return {
      labels: [],
      data: [],
      totalTopLevelComments: 0,
      commentCounts: [],
    };

  //filter for top-level comments (direct replies to the post)
  const topLevelComments = comments.filter(
    (comment) =>
      comment?.data?.created_utc && comment?.data?.parent_id?.startsWith("t3_"), // t3_ prefix indicates a post (not a comment)
  );

  //sort by creation time
  const validComments = topLevelComments.sort(
    (a, b) => a.data.created_utc - b.data.created_utc,
  );

  if (validComments.length === 0)
    return {
      labels: [],
      data: [],
      totalTopLevelComments: 0,
      commentCounts: [],
    };

  const postTime: Date = new Date(postCreatedUtc * 1000);
  const endTime: Date = new Date(
    postTime.getTime() + hoursToDisplay * 60 * 60 * 1000,
  );
  const intervalMs = (hoursToDisplay * 60 * 60 * 1000) / timeIntervals;

  //create time intervals
  const timeIntervalsArray = [];
  const intervalStarts = [];
  for (let i = 0; i <= timeIntervals; i++) {
    const time = new Date(postTime.getTime() + i * intervalMs);
    const hours = Math.round(i * (hoursToDisplay / timeIntervals));
    timeIntervalsArray.push(`${hours}h`);
    intervalStarts.push(time.getTime());
  }

  //initialize arrays for storing comment counts
  const commentCounts = new Array(timeIntervals + 1).fill(0);
  const cumulativeCounts = new Array(timeIntervals + 1).fill(0);

  //count comments in each interval
  validComments.forEach((comment) => {
    const commentTime: Date = new Date(comment.data.created_utc * 1000);
    //skip comments after our display window
    if (commentTime > endTime) return;

    //find which interval this comment belongs to
    const hoursSincePost =
      (commentTime.getTime() - postTime.getTime()) / (1000 * 60 * 60);
    const intervalIndex = Math.min(
      Math.floor((hoursSincePost / hoursToDisplay) * timeIntervals),
      timeIntervals - 1,
    );

    if (intervalIndex >= 0) {
      commentCounts[intervalIndex + 1]++;
    }
  });

  //calculate cumulative counts
  for (let i = 1; i <= timeIntervals; i++) {
    cumulativeCounts[i] = cumulativeCounts[i - 1] + commentCounts[i];
  }

  return {
    labels: timeIntervalsArray,
    data: cumulativeCounts,
    commentCounts: commentCounts.slice(1),
    totalTopLevelComments: validComments.length,
  };
};
export const EarlyCommentsActivityChart = ({
  comments,
  post,
}: {
  comments: CommentData[];
  post: PostData;
}) => {
  const [timeWindow, setTimeWindow] = useState(0); //default to first time window (12h)
  const { hours: hoursToDisplay, intervals: timeIntervals } =
    TIME_WINDOWS[timeWindow];

  const chartData = useMemo(() => {
    const { labels, data, totalTopLevelComments } = processCommentData(
      comments,
      post?.created_utc,
      hoursToDisplay,
      timeIntervals,
    );

    return {
      labels,
      datasets: [
        {
          label: "Top Level Comments",
          data: data,
          borderColor: "#9CA4CA",
          backgroundColor: "rgba(156, 164, 202, 0.1)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: "#9CA4CA",
          pointBorderColor: "#fff",
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#9CA4CA",
          pointHoverBorderColor: "#fff",
          pointHitRadius: 10,
          pointBorderWidth: 2,
        },
      ],
      totalTopLevelComments,
    };
  }, [comments, post?.created_utc, hoursToDisplay, timeIntervals]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (
            this: TooltipModel<"line">,
            context: TooltipItem<"line">,
          ) {
            return `${context.parsed.y} total comments by ${context.label}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Hours since post",
          color: "#9CA4CA",
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#9CA4CA",
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: timeIntervals,
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Comments",
          color: "#9CA4CA",
        },
        beginAtZero: true,
        ticks: {
          color: "#9CA4CA",
          precision: 0,
        },
        grid: {
          color: "rgba(156, 164, 202, 0.1)",
        },
      },
    },
  };
  return (
    <Card className="w-full max-w-2xl">
      <div className="h-64 w-full my-10">
        {chartData.labels.length > 0 ? (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <Text as="div" size="2" color="gray" className="mb-1">
                  Early Top Comment Activity
                </Text>
                <Text as="div" size="1" color="gray" className="opacity-70">
                  {chartData.totalTopLevelComments} early top-level comments
                </Text>
              </div>
              <div className="flex gap-2">
                {TIME_WINDOWS.map((window, index) => (
                  <Button
                    key={window.hours}
                    size="1"
                    variant={timeWindow === index ? "solid" : "soft"}
                    onClick={() => setTimeWindow(index)}
                    disabled={
                      window.hours >
                      millisecondsToHours(
                        Date.now() - post.created_utc * 1000,
                      ) /
                        0.5
                    }
                    className="text-xs"
                  >
                    {window.hours}h
                  </Button>
                ))}
              </div>
            </div>
            <div className="h-64 w-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        ) : (
          <div className="h-64 w-full flex flex-col items-center justify-center">
            <img
              className="w-16 h-16 my-5"
              src="/reddit-negative.png"
              alt="reddit"
            />
            <p className="text-gray-500">This comment thread is empty</p>
          </div>
        )}
      </div>
    </Card>
  );
};
