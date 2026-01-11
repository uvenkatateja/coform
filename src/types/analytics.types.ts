/**
 * Analytics Types
 * Backend pattern: Define data structures first
 */

export interface FormAnalytics {
    totalSubmissions: number;
    submissionsToday: number;
    submissionsThisWeek: number;
    submissionsThisMonth: number;
    completionRate: number;
    averageTimeToComplete?: number;
    dailySubmissions: DailySubmission[];
    fieldStats: FieldStat[];
}

export interface DailySubmission {
    date: string;
    count: number;
}

export interface FieldStat {
    fieldId: string;
    fieldLabel: string;
    fillRate: number; // Percentage of submissions that filled this field
    uniqueValues?: number;
}
