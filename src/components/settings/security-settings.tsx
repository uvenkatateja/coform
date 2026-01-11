"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormSchema } from "@/types/form.types";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useTransition } from "react";

interface SecuritySettingsProps {
    form: FormSchema;
    onUpdate: (updates: Partial<FormSchema>) => Promise<void>;
}

export function SecuritySettings({ form, onUpdate }: SecuritySettingsProps) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = (key: "honeypotEnabled" | "turnstileEnabled", value: boolean) => {
        startTransition(async () => {
            const currentSecurity = form.settings.security || {
                honeypotEnabled: false,
                turnstileEnabled: false,
            };

            await onUpdate({
                settings: {
                    ...form.settings,
                    security: {
                        ...currentSecurity,
                        [key]: value,
                    },
                },
            });
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Spam Protection</h3>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                    <div className="space-y-0.5">
                        <Label className="text-base">Honeypot Field</Label>
                        <p className="text-sm text-muted-foreground">
                            Adds an invisible field that traps bots. Frictionless for humans.
                        </p>
                    </div>
                    <Switch
                        checked={form.settings.security?.honeypotEnabled || false}
                        onCheckedChange={(checked) => handleToggle("honeypotEnabled", checked)}
                        disabled={isPending}
                    />
                </div>

                <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                    <div className="space-y-0.5">
                        <Label className="text-base">Cloudflare Turnstile</Label>
                        <p className="text-sm text-muted-foreground">
                            Standard CAPTCHA challenge. Requires Site Key in environment variables.
                        </p>
                    </div>
                    <Switch
                        checked={form.settings.security?.turnstileEnabled || false}
                        onCheckedChange={(checked) => handleToggle("turnstileEnabled", checked)}
                        disabled={isPending}
                    />
                </div>
            </div>

            {isPending && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> saving...
                </div>
            )}
        </div>
    );
}
