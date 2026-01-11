import type { Webhook, WebhookPayload, WebhookEvent } from "@/types/webhook.types";
import { webhookRepository } from "./repository";
import crypto from "crypto";

/**
 * Webhook Service
 * Backend pattern: Business logic layer
 */
export const webhookService = {
    /**
     * Generate HMAC signature for payload
     */
    generateSignature(payload: string, secret: string): string {
        return crypto
            .createHmac("sha256", secret)
            .update(payload)
            .digest("hex");
    },

    /**
     * Create webhook payload
     */
    createPayload(event: WebhookEvent, formId: string, data: Record<string, any>): WebhookPayload {
        return {
            event,
            timestamp: new Date().toISOString(),
            form_id: formId,
            data,
        };
    },

    /**
     * Send webhook with retry logic
     */
    async send(webhook: Webhook, payload: WebhookPayload): Promise<{ success: boolean; statusCode?: number }> {
        const body = JSON.stringify(payload);
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "X-Webhook-Event": payload.event,
        };

        // Add signature if secret exists
        if (webhook.secret) {
            headers["X-Webhook-Signature"] = this.generateSignature(body, webhook.secret);
        }

        try {
            const response = await fetch(webhook.url, {
                method: "POST",
                headers,
                body,
            });

            return {
                success: response.ok,
                statusCode: response.status,
            };
        } catch {
            return { success: false };
        }
    },

    /**
     * Trigger webhooks for an event
     */
    async trigger(formId: string, event: WebhookEvent, data: Record<string, any>): Promise<void> {
        const webhooks = await webhookRepository.getActiveByFormId(formId);
        const payload = this.createPayload(event, formId, data);

        // Fire and forget - don't block submission
        await Promise.allSettled(
            webhooks
                .filter((w) => w.events.includes(event))
                .map((w) => this.send(w, payload))
        );
    },

    /**
     * Generate secure secret
     */
    generateSecret(): string {
        return `whsec_${crypto.randomBytes(24).toString("hex")}`;
    },
};
