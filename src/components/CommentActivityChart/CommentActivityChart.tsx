import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format, parseISO } from "date-fns";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

type TimeGrouping = "hour" | "day" | "month" | "year";

interface Comment {
  data: {
    created_utc: number;
    is_placeholder?: boolean;
    [key: string]: any; // Allow additional properties
  };
}

interface CommentActivityChartProps {
  comments: Comment[];
}

export function CommentActivityChart({ comments }: CommentActivityChartProps) {
  const [groupBy, setGroupBy] = useState<TimeGrouping>("day");

  // Process comments data to group by selected time interval
  const chartData = useMemo(() => {
    if (!comments?.length) return null;

    try {
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const groupedComments = new Map<string, number>();

      // Initialize buckets for hourly view
      if (groupBy === "hour") {
        for (let i = 0; i <= 48; i += 4) {
          const bucketKey = i < 48 ? `${i}-${i + 3}h` : "48h+";
          groupedComments.set(bucketKey, 0);
        }
      }

      // Process comments in a single pass
      for (const comment of comments) {
        try {
          // Skip placeholder comments if needed
          if (comment.data.is_placeholder) continue;

          const commentTime = comment.data.created_utc;
          if (typeof commentTime !== "number" || isNaN(commentTime)) continue;

          const date = new Date(commentTime * 1000);
          if (isNaN(date.getTime())) continue; // Skip invalid dates

          let groupKey: string;

          switch (groupBy) {
            case "hour": {
              const hoursAgo = Math.floor((now - commentTime) / 3600);
              if (hoursAgo > 48) {
                groupKey = "48h+";
              } else {
                const hourBucket = Math.min(45, Math.floor(hoursAgo / 4) * 4);
                groupKey = `${hourBucket}-${hourBucket + 3}h`;
              }
              break;
            }
            case "day":
              groupKey = format(date, "yyyy-MM-dd");
              break;
            case "month":
              groupKey = format(date, "yyyy-MM");
              break;
            case "year":
              groupKey = format(date, "yyyy");
              break;
            default:
              continue;
          }

          groupedComments.set(
            groupKey,
            (groupedComments.get(groupKey) || 0) + 1,
          );
        } catch (error) {
          console.warn("Error processing comment:", error);
          continue;
        }
      }

      // Convert to arrays for chart
      let labels: string[] = [];
      const data: number[] = [];
      const tooltipLabels: Record<string, string> = {};

      if (groupBy === "hour") {
        // For hourly view, we already have all buckets initialized
        const sortedEntries = Array.from(groupedComments.entries()).sort(
          ([a], [b]) => {
            if (a === "48h+") return 1;
            if (b === "48h+") return -1;
            return parseInt(a) - parseInt(b);
          },
        );

        for (const [key, count] of sortedEntries) {
          if (key === "48h+") {
            labels.push("48h+");
            tooltipLabels["48h+"] = "48h+";
          } else {
            const startHour = parseInt(key);
            labels.push(`${startHour}h`);
            tooltipLabels[`${startHour}h`] = `${key} ago`;
          }
          data.push(count);
        }
      } else {
        // For other time groupings
        const sortedEntries = Array.from(groupedComments.entries())
          .filter(([_, count]) => count > 0) // Only include non-zero counts for non-hourly views
          .sort(([a], [b]) => a.localeCompare(b));

        for (const [key, count] of sortedEntries) {
          labels.push(key);
          data.push(count);
        }
      }

      // Format labels based on the selected time interval
      const formatLabel = (label: string) => {
        if (groupBy === "hour") return label;

        try {
          const date = parseISO(
            groupBy === "month"
              ? `${label}-01`
              : groupBy === "year"
                ? `${label}-01-01`
                : label,
          );

          switch (groupBy) {
            case "day":
              return format(date, "MMM d, yyyy");
            case "month":
              return format(date, "MMM yyyy");
            case "year":
              return label;
            default:
              return label;
          }
        } catch (error) {
          console.warn("Error formatting label:", label, error);
          return label;
        }
      };

      const chartTitle =
        groupBy === "hour"
          ? "Comment Activity (Last 48 Hours)"
          : `Comment Activity (By ${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)})`;

      return {
        labels: labels.map((label) => formatLabel(label)),
        datasets: [
          {
            label: "Comments",
            data: data,
            fill: true,
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            borderColor: "rgba(99, 102, 241, 1)",
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: "rgba(99, 102, 241, 1)",
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
        chartTitle,
        tooltipLabels,
      };
    } catch (error) {
      console.error("Error generating chart data:", error);
      return null;
    }
  }, [comments, groupBy]);

  if (!chartData) {
    return <div className="text-center p-4">No comment data available</div>;
  }

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{chartData.chartTitle}</h3>
        <div className="flex space-x-2">
          {(["hour", "day", "month", "year"] as const).map((interval) => (
            <button
              key={interval}
              onClick={() => setGroupBy(interval)}
              className={`px-3 py-1 text-sm rounded-md ${
                groupBy === interval
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {interval.charAt(0).toUpperCase() + interval.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="relative h-80 w-full">
        <Line
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets,
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  title: (context) => {
                    const label = context[0].label;
                    return chartData.tooltipLabels[label] || label;
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(255, 255, 255, 0.1)",
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              },
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.7)",
                  maxRotation: 45,
                  minRotation: 45,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
