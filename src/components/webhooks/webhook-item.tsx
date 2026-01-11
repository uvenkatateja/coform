import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { Webhook } from "@/types/webhook.types";

interface WebhookItemProps {
    webhook: Webhook;
    onToggle: (isActive: boolean) => void;
    onDelete: () => void;
    loading?: boolean;
}

/**
 * Webhook Item - Presentational component
 */
export function WebhookItem({ webhook, onToggle, onDelete, loading }: WebhookItemProps) {
    const [copied, setCopied] = useState(false);

    const copySecret = () => {
        if (webhook.secret) {
            navigator.clipboard.writeText(webhook.secret);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm font-medium truncate">{webhook.url}</p>
                <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs text-muted-foreground bg-muted px-1 rounded">
                        {webhook.secret?.substring(0, 20)}...
                    </code>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copySecret}>
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Switch
                    checked={webhook.is_active}
                    onCheckedChange={onToggle}
                    disabled={loading}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDelete}
                    disabled={loading}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
