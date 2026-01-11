"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Copy, Check } from "lucide-react";
import { createApiKeyAction, revokeApiKeyAction } from "@/lib/api/actions";
import { formatDate } from "@/lib/utils";
import type { ApiKey } from "@/types/api.types";

interface ApiKeySettingsProps {
    initialKeys: ApiKey[];
}

export function ApiKeySettings({ initialKeys }: ApiKeySettingsProps) {
    const [keys, setKeys] = useState(initialKeys);
    const [isPending, startTransition] = useTransition();
    const [newKeyName, setNewKeyName] = useState("");

    // New Key Dialog State
    const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
    const [newSecretKey, setNewSecretKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCreate = () => {
        if (!newKeyName.trim()) return;

        startTransition(async () => {
            try {
                const result = await createApiKeyAction(newKeyName);
                setKeys((prev) => [result.apiKey, ...prev]);
                setNewSecretKey(result.secretKey);
                setShowNewKeyDialog(true);
                setNewKeyName("");
            } catch (error) {
                console.error("Failed to create key:", error);
            }
        });
    };

    const handleRevoke = (id: string) => {
        if (!confirm("Are you sure? This action cannot be undone and any integrations using this key will stop working.")) return;

        startTransition(async () => {
            await revokeApiKeyAction(id);
            setKeys((prev) => prev.filter((k) => k.id !== id));
        });
    };

    const copyToClipboard = () => {
        if (newSecretKey) {
            navigator.clipboard.writeText(newSecretKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-end gap-4">
                <div className="flex-1 max-w-sm space-y-2">
                    <Input
                        placeholder="Key Name (e.g. Website Integration)"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        disabled={isPending}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                </div>
                <Button onClick={handleCreate} disabled={isPending || !newKeyName.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate New Key
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Key Prefix</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Used</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {keys.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No API keys generated yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            keys.map((key) => (
                                <TableRow key={key.id}>
                                    <TableCell className="font-medium">{key.name}</TableCell>
                                    <TableCell>
                                        <code className="bg-muted px-2 py-1 rounded text-xs">{key.key_prefix}</code>
                                    </TableCell>
                                    <TableCell>{formatDate(key.created_at)}</TableCell>
                                    <TableCell>
                                        {key.last_used_at ? formatDate(key.last_used_at) : "Never"}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRevoke(key.id)}
                                            disabled={isPending}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>API Key Generated</DialogTitle>
                        <DialogDescription>
                            Please copy your secret key now. You won&apos;t be able to see it again.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center gap-2 mt-4">
                        <code className="flex-1 bg-muted p-3 rounded-md border text-sm font-mono break-all">
                            {newSecretKey}
                        </code>
                        <Button size="icon" onClick={copyToClipboard}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setShowNewKeyDialog(false)}>Done</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
