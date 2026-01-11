"use client";

import { Button } from "@/components/ui/button";
import { FormCard } from "@/components/dashboard/form-card";
import { Plus, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { deleteFormAction } from "@/lib/forms/actions";
import { signOut } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AIFormGenerator } from "@/components/ai/ai-form-generator";
import { OrgSwitcher } from "./org-switcher";
import type { Database } from "@/types/database.types";
import type { OrganizationWithRole } from "@/types/organization.types";

type Form = Database["public"]["Tables"]["forms"]["Row"];

interface DashboardClientProps {
  forms: Form[];
  organizations: OrganizationWithRole[];
  currentOrgId: string | null;
}

export function DashboardClient({ forms, organizations, currentOrgId }: DashboardClientProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (formId: string) => {
    setFormToDelete(formId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!formToDelete) return;

    setDeleting(true);
    await deleteFormAction(formToDelete);
    setDeleting(false);
    setDeleteDialogOpen(false);
    setFormToDelete(null);
    router.refresh();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold">CoForm</span>
              <div className="h-6 w-px bg-border hidden md:block" />
              <div className="hidden md:block">
                <OrgSwitcher
                  organizations={organizations}
                  currentOrgId={currentOrgId}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/settings">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="container mx-auto p-4 md:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-8">
            <h1 className="text-2xl font-bold md:text-3xl">
              {currentOrgId ?
                `${organizations.find(o => o.id === currentOrgId)?.name || 'Team'} Forms`
                : "My Forms"}
            </h1>
            <div className="flex gap-2">
              <AIFormGenerator organizationId={currentOrgId} />
              <Button variant="outline" asChild>
                <Link href="/templates">
                  Use Template
                </Link>
              </Button>
              <Button asChild>
                <Link href={currentOrgId ? `/editor/new?orgId=${currentOrgId}` : "/editor/new"}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Form
                </Link>
              </Button>
            </div>
          </div>

          {forms.length === 0 ? (
            <div className="rounded-lg border p-8 text-center md:p-12">
              <p className="mb-4 text-muted-foreground">
                You don't have any forms yet
              </p>
              <Button asChild>
                <Link href={currentOrgId ? `/editor/new?orgId=${currentOrgId}` : "/editor/new"}>
                  Create Your First Form
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {forms.map((form) => (
                <FormCard
                  key={form.id}
                  form={form}
                  onDelete={() => handleDeleteClick(form.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this form? This action cannot be undone and all submissions will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
