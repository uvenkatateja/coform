/**
 * Email Types
 * Backend pattern: Define data structures first
 */

export interface EmailConfig {
    enabled: boolean;
    recipients: string[];
}

export interface SubmissionEmailData {
    formTitle: string;
    formId: string;
    submissionId: string;
    submittedAt: string;
    fields: { label: string; value: string }[];
}
