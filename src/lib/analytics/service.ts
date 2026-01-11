import type { FormAnalytics, DailySubmission, FieldStat } from "@/types/analytics.types";
import type { FormSchema } from "@/types/form.types";
import type { Database } from "@/types/database.types";

type Submission = Database["public"]["Tables"]["submissions"]["Row"];

/**
 * Analytics Service
 * Backend pattern: Pure functions for data transformation
 * No side effects, easy to test
 */
export const analyticsService = {
    /**
     * Calculate analytics from submissions
     */
    calculate(submissions: Submission[], formSchema: FormSchema): FormAnalytics {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        return {
            totalSubmissions: submissions.length,
            submissionsToday: this.countAfterDate(submissions, today),
            submissionsThisWeek: this.countAfterDate(submissions, weekAgo),
            submissionsThisMonth: this.countAfterDate(submissions, monthAgo),
            completionRate: this.calculateCompletionRate(submissions, formSchema),
            dailySubmissions: this.groupByDay(submissions, 30),
            fieldStats: this.calculateFieldStats(submissions, formSchema),
        };
    },

    /**
     * Count submissions after a date
     */
    countAfterDate(submissions: Submission[], date: Date): number {
        return submissions.filter(
            (s) => new Date(s.created_at) >= date
        ).length;
    },

    /**
     * Group submissions by day for chart
     */
    groupByDay(submissions: Submission[], days: number): DailySubmission[] {
        const result: Map<string, number> = new Map();
        const now = new Date();

        // Initialize all days with 0
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const key = date.toISOString().split("T")[0];
            result.set(key, 0);
        }

        // Count submissions per day
        submissions.forEach((s) => {
            const key = s.created_at.split("T")[0];
            if (result.has(key)) {
                result.set(key, (result.get(key) || 0) + 1);
            }
        });

        return Array.from(result.entries()).map(([date, count]) => ({
            date,
            count,
        }));
    },

    /**
     * Calculate completion rate (% of required fields filled)
     */
    calculateCompletionRate(submissions: Submission[], formSchema: FormSchema): number {
        if (submissions.length === 0) return 0;

        const requiredFields = formSchema.fields.filter((f) => f.required);
        if (requiredFields.length === 0) return 100;

        let totalFilled = 0;
        let totalRequired = 0;

        submissions.forEach((s) => {
            const data = s.data as Record<string, any>;
            requiredFields.forEach((field) => {
                totalRequired++;
                if (data[field.id] !== undefined && data[field.id] !== "") {
                    totalFilled++;
                }
            });
        });

        return Math.round((totalFilled / totalRequired) * 100);
    },

    /**
     * Calculate per-field statistics
     */
    calculateFieldStats(submissions: Submission[], formSchema: FormSchema): FieldStat[] {
        if (submissions.length === 0) return [];

        return formSchema.fields.map((field) => {
            let filledCount = 0;
            const uniqueValues = new Set<string>();

            submissions.forEach((s) => {
                const data = s.data as Record<string, any>;
                const value = data[field.id];
                if (value !== undefined && value !== "") {
                    filledCount++;
                    uniqueValues.add(String(value));
                }
            });

            return {
                fieldId: field.id,
                fieldLabel: field.label,
                fillRate: Math.round((filledCount / submissions.length) * 100),
                uniqueValues: uniqueValues.size,
            };
        });
    },
};
