import type { DailySubmission } from "@/types/analytics.types";

interface SubmissionChartProps {
    data: DailySubmission[];
}

/**
 * Simple bar chart using pure CSS
 * No external dependencies - lightweight & fast
 */
export function SubmissionChart({ data }: SubmissionChartProps) {
    const maxCount = Math.max(...data.map((d) => d.count), 1);

    // Show only last 14 days for cleaner display
    const displayData = data.slice(-14);

    return (
        <div className="space-y-2">
            <h3 className="text-sm font-medium">Submissions (Last 14 days)</h3>
            <div className="flex items-end gap-1 h-32">
                {displayData.map((day) => {
                    const height = (day.count / maxCount) * 100;
                    const date = new Date(day.date);
                    const label = date.toLocaleDateString("en", { weekday: "short" });

                    return (
                        <div
                            key={day.date}
                            className="flex-1 flex flex-col items-center gap-1"
                            title={`${day.date}: ${day.count} submissions`}
                        >
                            <div
                                className="w-full bg-primary/80 rounded-t hover:bg-primary transition-colors cursor-pointer"
                                style={{ height: `${Math.max(height, 2)}%` }}
                            />
                            <span className="text-[10px] text-muted-foreground">
                                {label.charAt(0)}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>14 days ago</span>
                <span>Today</span>
            </div>
        </div>
    );
}
