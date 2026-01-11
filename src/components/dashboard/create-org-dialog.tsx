"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation"; // Correct hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { createOrganizationAction } from "@/lib/organizations/actions";

interface CreateOrgDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateOrgDialog({ open, onOpenChange }: CreateOrgDialogProps) {
    const router = useRouter(); // Initialize router
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    function handleNameChange(val: string) {
        setName(val);
        // Auto-generate slug
        setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name || !slug) return;

        setError(null);
        startTransition(async () => {
            const result = await createOrganizationAction({ name, slug });
            if (result.success && result.orgId) {
                onOpenChange(false);
                setName("");
                setSlug("");
                // Switch to new org
                router.push(`/dashboard?orgId=${result.orgId}`);
            } else {
                setError(result.error || "Failed to create organization");
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Team</DialogTitle>
                    <DialogDescription>
                        Create a team to collaborate on forms.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Team Name</Label>
                        <Input
                            id="name"
                            placeholder="Acme Corp"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            disabled={isPending}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Team URL Slug</Label>
                        <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-1">/</span>
                            <Input
                                id="slug"
                                placeholder="acme-corp"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-destructive font-medium">{error}</p>}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || !name}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Team
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
