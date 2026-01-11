"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { History, RotateCcw, Trash2, Save } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
    createVersionAction,
    restoreVersionAction,
    deleteVersionAction,
} from "@/lib/versions/actions";
import type { VersionSummary } from "@/types/version.types";

// ============================================
// Types
// ============================================

interface VersionHistoryProps {
    formId: string;
    initialVersions: VersionSummary[];
}

interface VersionItemProps {
    version: VersionSummary;
    isLatest: boolean;
    isPending: boolean;
    onRestore: (id: string) => void;
    onDelete: (id: string) => void;
}

// ============================================
// Main Component
// ============================================

export function VersionHistory(props: VersionHistoryProps): JSX.Element {
    const { formId, initialVersions } = props;

    const [versions, setVersions] = useState<VersionSummary[]>(initialVersions);
    const [isPending, startTransition] = useTransition();
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [description, setDescription] = useState("");

    function handleSaveVersion(): void {
        if (!description.trim()) {
            return;
        }

        startTransition(async () => {
            const result = await createVersionAction(formId, description);

            if (result.success) {
                // Refresh versions list
                const newVersion: VersionSummary = {
                    id: crypto.randomUUID(), // Temporary ID
                    version: versions.length > 0 ? versions[0].version + 1 : 1,
                    createdAt: new Date().toISOString(),
                    description: description,
                    fieldCount: 0, // Will be correct on next page load
                };
                setVersions([newVersion, ...versions]);
                setShowSaveDialog(false);
                setDescription("");
            }
        });
    }

    function handleRestore(versionId: string): void {
        const confirmed = confirm(
            "This will restore the form to this version. A backup of the current state will be created automatically. Continue?"
        );

        if (!confirmed) {
            return;
        }

        startTransition(async () => {
            const result = await restoreVersionAction(formId, versionId);

            if (result.success) {
                window.location.reload();
            }
        });
    }

    function handleDelete(versionId: string): void {
        const confirmed = confirm("Delete this version? This cannot be undone.");

        if (!confirmed) {
            return;
        }

        startTransition(async () => {
            const result = await deleteVersionAction(versionId, formId);

            if (result.success) {
                setVersions(versions.filter((v) => v.id !== versionId));
            }
        });
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Version History
                </h3>
                <Button size="sm" onClick={() => setShowSaveDialog(true)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Version
                </Button>
            </div>

            {renderVersionList(versions, isPending, handleRestore, handleDelete)}

            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save Version</DialogTitle>
                        <DialogDescription>
                            Create a snapshot of the current form state that you can restore
                            later.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Input
                            placeholder="Version description (e.g., Added email field)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSaveVersion();
                                }
                            }}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveVersion}
                            disabled={isPending || !description.trim()}
                        >
                            Save Version
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ============================================
// Helper Render Functions
// ============================================

function renderVersionList(
    versions: VersionSummary[],
    isPending: boolean,
    onRestore: (id: string) => void,
    onDelete: (id: string) => void
): JSX.Element {
    if (versions.length === 0) {
        return (
            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No versions saved yet.</p>
                <p className="text-sm">Click "Save Version" to create a snapshot.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {versions.map((version, index) => (
                <VersionItem
                    key={version.id}
                    version={version}
                    isLatest={index === 0}
                    isPending={isPending}
                    onRestore={onRestore}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

// ============================================
// Sub-Components
// ============================================

function VersionItem(props: VersionItemProps): JSX.Element {
    const { version, isLatest, isPending, onRestore, onDelete } = props;

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium">Version {version.version}</span>
                    {isLatest && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            Latest
                        </span>
                    )}
                </div>
                <div className="text-sm text-muted-foreground">
                    {version.description || "No description"}
                </div>
                <div className="text-xs text-muted-foreground">
                    {formatDate(version.createdAt)} • {version.fieldCount} fields
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRestore(version.id)}
                    disabled={isPending}
                >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Restore
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(version.id)}
                    disabled={isPending}
                    className="text-destructive hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
