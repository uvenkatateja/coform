"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Save, ArrowLeft, Copy, Check, Users2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PresenceAvatars } from "./presence-avatars";
import { generateShareToken } from "@/lib/forms/collaboration";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormSchema, UserPresence } from "@/types/form.types";

interface EditorHeaderProps {
  formId: string;
  form: FormSchema;
  isPublic: boolean;
  currentUser: { id: string; name: string };
  isSyncing?: boolean;
  activeUsers?: UserPresence[];
  onSave: () => void;
  onTogglePublic?: (isPublic: boolean) => Promise<void>;
}

export function EditorHeader({
  formId,
  form,
  isPublic,
  currentUser,
  isSyncing = false,
  activeUsers = [],
  onSave,
  onTogglePublic,
}: EditorHeaderProps) {
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [editorShareToken, setEditorShareToken] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    await onSave();
    setSaving(false);
  };

  const publicFormUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/form/${formId}`
    : '';

  const handleGenerateEditorLink = async () => {
    try {
      const token = await generateShareToken(formId);
      setEditorShareToken(token);
    } catch (error) {
      console.error("Failed to generate share link:", error);
    }
  };

  const editorShareUrl = editorShareToken && typeof window !== 'undefined'
    ? `${window.location.origin}/editor/shared/${editorShareToken}`
    : "";

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b px-4 md:h-16 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="hidden h-6 w-px bg-border sm:block" />
          <div className="hidden sm:block">
            <Logo />
          </div>
          <span className="max-w-[150px] truncate text-sm text-muted-foreground sm:max-w-none">
            {form.title}
          </span>
          {isSyncing && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Active Users */}
          {activeUsers.length > 1 && (
            <>
              <PresenceAvatars users={activeUsers} currentUserId={currentUser.id} />
              <div className="hidden h-6 w-px bg-border md:block" />
            </>
          )}

          {/* Share Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareDialogOpen(true)}
            className="hidden md:flex"
          >
            <Users2 className="h-4 w-4" />
            Share
          </Button>

          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" />
            <span className="hidden md:inline">{saving ? "Saving..." : "Save"}</span>
          </Button>
        </div>
      </header>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Form</DialogTitle>
            <DialogDescription>
              Share your form for collaboration or public submissions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Public Form Link */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Public Form (Submissions)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTogglePublic?.(!isPublic)}
                >
                  {isPublic ? "Public" : "Private"}
                </Button>
              </div>
              {isPublic && (
                <div className="flex gap-2">
                  <Input value={publicFormUrl} readOnly className="text-sm" />
                  <Button size="icon" variant="outline" onClick={() => copyLink(publicFormUrl)}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Anyone with this link can submit responses
              </p>
            </div>

            {/* Editor Collaboration Link */}
            <div className="space-y-2">
              <Label>Editor Link (Collaboration)</Label>
              {!editorShareToken ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGenerateEditorLink}
                >
                  <Users2 className="h-4 w-4 mr-2" />
                  Generate Collaboration Link
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Input value={editorShareUrl} readOnly className="text-sm" />
                  <Button size="icon" variant="outline" onClick={() => copyLink(editorShareUrl)}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Anyone with this link can edit the form (requires login)
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
