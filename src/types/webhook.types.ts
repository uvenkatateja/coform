/**
 * Webhook Types
 * Backend pattern: Define data structures first
 */

export interface Webhook {
    id: string;
    form_id: string;
    url: string;
    events: WebhookEvent[];
    secret?: string;
    is_active: boolean;
    created_at: string;
}

export type WebhookEvent = "submission.created";

export interface WebhookPayload {
    event: WebhookEvent;
    timestamp: string;
    form_id: string;
    data: Record<string, any>;
}

export interface WebhookDelivery {
    id: string;
    webhook_id: string;
    status: "success" | "failed";
    status_code?: number;
    response?: string;
    created_at: string;
}
