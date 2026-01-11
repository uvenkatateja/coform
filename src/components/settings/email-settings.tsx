"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X, Plus, Mail } from "lucide-react";

interface EmailSettingsProps {
    enabled: boolean;
    emails: string[];
    onSave: (enabled: boolean, emails: string[]) => Promise<void>;
}

/**
 * Email Settings Component
 */
export function EmailSettings({ enabled, emails: initialEmails, onSave }: EmailSettingsProps) {
    const [isEnabled, setIsEnabled] = useState(enabled);
    const [emails, setEmails] = useState(initialEmails);
    const [newEmail, setNewEmail] = useState("");
    const [isPending, startTransition] = useTransition();

    const addEmail = () => {
        const email = newEmail.trim().toLowerCase();
        if (!email || !email.includes("@") || emails.includes(email)) return;

        setEmails((prev) => [...prev, email]);
        setNewEmail("");
    };

    const removeEmail = (email: string) => {
        setEmails((prev) => prev.filter((e) => e !== email));
    };

    const handleSave = () => {
        startTransition(async () => {
            await onSave(isEnabled, emails);
        });
    };

    const hasChanges = isEnabled !== enabled || JSON.stringify(emails) !== JSON.stringify(initialEmails);

    return (
        <div className="space-y-4">
            {/* Enable Toggle */}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                        Receive an email when someone submits a response
                    </p>
                </div>
                <Switch
                    checked={isEnabled}
                    onCheckedChange={setIsEnabled}
                    disabled={isPending}
                />
            </div>

            {isEnabled && (
                <>
                    {/* Add Email */}
                    <div className="flex gap-2">
                        <Input
                            type="email"
                            placeholder="email@example.com"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addEmail()}
                            disabled={isPending}
                        />
                        <Button onClick={addEmail} variant="outline" disabled={isPending}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Email List */}
                    {emails.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-4 text-center">
                            <Mail className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Add email addresses to receive notifications
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {emails.map((email) => (
                                <div
                                    key={email}
                                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                                >
                                    <span className="text-sm">{email}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => removeEmail(email)}
                                        disabled={isPending}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Save Button */}
            {hasChanges && (
                <Button onClick={handleSave} disabled={isPending} className="w-full">
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            )}
        </div>
    );
}
