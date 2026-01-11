"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FormSchema } from "@/types/form.types";

interface DesignSettingsProps {
    design: FormSchema["settings"]["design"];
    onUpdate: (design: FormSchema["settings"]["design"]) => void;
}

export function DesignSettings({ design, onUpdate }: DesignSettingsProps) {
    const currentDesign = design || {
        theme: "system",
        colors: {
            primary: "#000000",
            background: "#ffffff",
            text: "#000000"
        }
    };

    const updateColors = (key: string, value: string) => {
        onUpdate({
            ...currentDesign,
            colors: {
                ...currentDesign.colors!,
                [key]: value
            }
        });
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of your form</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-2">
                        <Label>Theme</Label>
                        <Select
                            value={currentDesign.theme}
                            onValueChange={(val: any) => onUpdate({ ...currentDesign, theme: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="primaryColor">Primary Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="primaryColor"
                                    type="color"
                                    className="w-12 h-10 p-1"
                                    value={currentDesign.colors?.primary}
                                    onChange={(e) => updateColors("primary", e.target.value)}
                                />
                                <Input
                                    value={currentDesign.colors?.primary}
                                    onChange={(e) => updateColors("primary", e.target.value)}
                                    className="font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bgColor">Background Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="bgColor"
                                    type="color"
                                    className="w-12 h-10 p-1"
                                    value={currentDesign.colors?.background}
                                    onChange={(e) => updateColors("background", e.target.value)}
                                />
                                <Input
                                    value={currentDesign.colors?.background}
                                    onChange={(e) => updateColors("background", e.target.value)}
                                    className="font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="textColor">Text Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="textColor"
                                    type="color"
                                    className="w-12 h-10 p-1"
                                    value={currentDesign.colors?.text}
                                    onChange={(e) => updateColors("text", e.target.value)}
                                />
                                <Input
                                    value={currentDesign.colors?.text}
                                    onChange={(e) => updateColors("text", e.target.value)}
                                    className="font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Live Preview hint */}
            <div className="bg-muted p-4 rounded-lg text-sm text-center text-muted-foreground">
                Changes are applied automatically to the form preview.
            </div>
        </div>
    );
}
