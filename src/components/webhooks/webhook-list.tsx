"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WebhookItem } from "./webhook-item";
import { createWebhookAction, deleteWebhookAction, toggleWebhookAction } from "@/lib/webhooks/actions";
import { Plus, Webhook } from "lucide-react";
import type { Webhook as WebhookType } from "@/types/webhook.types";

interface WebhookListProps {
    formId: string;
    initialWebhooks: WebhookType[];
}

/**
 * Webhook List - Container component with state
 */
export function WebhookList({ formId, initialWebhooks }: WebhookListProps) {
    const [webhooks, setWebhooks] = useState(initialWebhooks);
    const [newUrl, setNewUrl] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleAdd = () => {
        if (!newUrl.trim() || !newUrl.startsWith("http")) return;

        startTransition(async () => {
            const webhook = await createWebhookAction(formId, newUrl.trim());
            setWebhooks((prev) => [webhook, ...prev]);
            setNewUrl("");
        });
    };

    const handleToggle = (webhookId: string, isActive: boolean) => {
        startTransition(async () => {
            await toggleWebhookAction(webhookId, formId, isActive);
            setWebhooks((prev) =>
                prev.map((w) => (w.id === webhookId ? { ...w, is_active: isActive } : w))
            );
        });
    };

    const handleDelete = (webhookId: string) => {
        startTransition(async () => {
            await deleteWebhookAction(webhookId, formId);
            setWebhooks((prev) => prev.filter((w) => w.id !== webhookId));
        });
    };

    return (
        <div className="space-y-4">
            {/* Add Webhook */}
            <div className="flex gap-2">
                <Input
                    placeholder="https://your-server.com/webhook"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    disabled={isPending}
                />
                <Button onClick={handleAdd} disabled={isPending || !newUrl.trim()}>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add</span>
                </Button>
            </div>

            {/* Webhook List */}
            {webhooks.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center">
                    <Webhook className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        No webhooks configured. Add a URL to receive submission notifications.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {webhooks.map((webhook) => (
                        <WebhookItem
                            key={webhook.id}
                            webhook={webhook}
                            onToggle={(isActive) => handleToggle(webhook.id, isActive)}
                            onDelete={() => handleDelete(webhook.id)}
                            loading={isPending}
                        />
                    ))}
                </div>
            )}

            {/* Info */}
            <p className="text-xs text-muted-foreground">
                Webhooks receive a POST request with submission data. Each webhook has a secret for signature verification.
            </p>
        </div>
    );
}
