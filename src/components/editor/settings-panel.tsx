"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { FormSchema } from "@/types/form.types";

interface SettingsPanelProps {
    settings: FormSchema["settings"];
    onUpdate: (settings: FormSchema["settings"]) => void;
}

export function SettingsPanel({ settings, onUpdate }: SettingsPanelProps) {
    const updateQuiz = (updates: Partial<NonNullable<FormSchema["settings"]["quiz"]>>) => {
        onUpdate({
            ...settings,
            quiz: {
                enabled: false,
                ...settings.quiz,
                ...updates
            }
        });
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Configure basic form behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="submitText">Submit Button Text</Label>
                        <Input
                            id="submitText"
                            value={settings.submitText}
                            onChange={(e) => onUpdate({ ...settings, submitText: e.target.value })}
                            placeholder="Submit"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="successMessage">Success Message</Label>
                        <Input
                            id="successMessage"
                            value={settings.successMessage}
                            onChange={(e) => onUpdate({ ...settings, successMessage: e.target.value })}
                            placeholder="Thank you for your submission!"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="redirectUrl">Redirect URL (Optional)</Label>
                        <Input
                            id="redirectUrl"
                            value={settings.redirectUrl || ""}
                            onChange={(e) => onUpdate({ ...settings, redirectUrl: e.target.value })}
                            placeholder="https://example.com/thank-you"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Quiz Mode</CardTitle>
                    <CardDescription>Turn this form into a graded quiz</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Enable Quiz Scoring</Label>
                            <div className="text-sm text-muted-foreground">
                                Assign points and correct answers to fields
                            </div>
                        </div>
                        <Switch
                            checked={settings.quiz?.enabled}
                            onCheckedChange={(checked) => updateQuiz({ enabled: checked })}
                        />
                    </div>

                    {settings.quiz?.enabled && (
                        <>
                            <Separator />
                            <div className="grid gap-2">
                                <Label htmlFor="passingScore">Passing Score (Points)</Label>
                                <Input
                                    id="passingScore"
                                    type="number"
                                    value={settings.quiz.passingScore || 0}
                                    onChange={(e) => updateQuiz({ passingScore: parseInt(e.target.value) || 0 })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Show Answers</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Show correct answers to user after submission
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.quiz.showAnswers}
                                    onCheckedChange={(checked) => updateQuiz({ showAnswers: checked })}
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Protect your form from spam</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Honeypot Field</Label>
                            <div className="text-sm text-muted-foreground">
                                Invisible field to trap bots
                            </div>
                        </div>
                        <Switch
                            checked={settings.security?.honeypotEnabled}
                            onCheckedChange={(checked) => onUpdate({
                                ...settings,
                                security: { ...settings.security, honeypotEnabled: checked } as any
                            })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Cloudflare Turnstile</Label>
                            <div className="text-sm text-muted-foreground">
                                Smart CAPTCHA protection
                            </div>
                        </div>
                        <Switch
                            checked={settings.security?.turnstileEnabled}
                            onCheckedChange={(checked) => onUpdate({
                                ...settings,
                                security: { ...settings.security, turnstileEnabled: checked } as any
                            })}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
