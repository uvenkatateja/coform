import { StatCard } from "./stat-card";
import { SubmissionChart } from "./submission-chart";
import { FieldStats } from "./field-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, Calendar, CheckCircle } from "lucide-react";
import type { FormAnalytics } from "@/types/analytics.types";

interface AnalyticsDashboardProps {
    analytics: FormAnalytics;
}

/**
 * Analytics Dashboard - Composes all analytics components
 */
export function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Submissions"
                    value={analytics.totalSubmissions}
                    icon={FileText}
                />
                <StatCard
                    title="This Week"
                    value={analytics.submissionsThisWeek}
                    description={`+${analytics.submissionsToday} today`}
                    icon={TrendingUp}
                />
                <StatCard
                    title="This Month"
                    value={analytics.submissionsThisMonth}
                    icon={Calendar}
                />
                <StatCard
                    title="Completion Rate"
                    value={`${analytics.completionRate}%`}
                    description="Required fields filled"
                    icon={CheckCircle}
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Submissions Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Submissions Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SubmissionChart data={analytics.dailySubmissions} />
                    </CardContent>
                </Card>

                {/* Field Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Field Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldStats stats={analytics.fieldStats} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
