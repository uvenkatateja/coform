"use client";

import type { FormField, UserPresence } from "@/types/form.types";
import { FieldItem } from "./field-item";
import { toast } from "@/hooks/use-toast";

interface FieldListProps {
  fields: FormField[];
  selectedId: string | null;
  presences: UserPresence[];
  currentUserId: string;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<FormField>) => void;
  onDelete: (id: string) => void;
}

export function FieldList({
  fields,
  selectedId,
  presences,
  currentUserId,
  onSelect,
  onUpdate,
  onDelete,
}: FieldListProps) {
  if (fields.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No fields yet. Add a field to get started.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {fields.map((field) => {
        // Find other users editing this field
        const editors = presences.filter(
          (u) => u.activeFieldId === field.id && u.userId !== currentUserId
        );
        const isLocked = editors.length > 0;

        return (
          <FieldItem
            key={field.id}
            field={field}
            isSelected={field.id === selectedId}
            activeUsers={namesOnly(presences.filter(u => u.activeFieldId === field.id))}
            isLocked={isLocked}
            lockedBy={editors[0]?.userName}
            onSelect={() => {
              if (isLocked) {
                toast({
                  title: "Field Locked",
                  description: `${editors[0]?.userName} is currently editing this field.`,
                  variant: "destructive",
                });
                return;
              }
              onSelect(field.id);
            }}
            onUpdate={(updates) => onUpdate(field.id, updates)}
            onDelete={() => onDelete(field.id)}
          />
        );
      })}
    </div>
  );
}

// Helper to keep the prop cleaner
function namesOnly(users: UserPresence[]) {
  return users;
}
