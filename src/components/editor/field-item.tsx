"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FormField, UserPresence } from "@/types/form.types";
import { cn } from "@/lib/utils";
import { FormFieldRenderer } from "@/components/form/form-field-renderer";

interface FieldItemProps {
  field: FormField;
  isSelected: boolean;
  activeUsers: UserPresence[];
  isLocked?: boolean;
  lockedBy?: string;
  onSelect: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
  onDelete: () => void;
}

/**
 * Sortable field item with drag handle, live preview, and locking
 */
export function FieldItem({
  field,
  isSelected,
  activeUsers,
  isLocked,
  lockedBy,
  onSelect,
  onDelete,
}: FieldItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id, disabled: isLocked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const firstActiveUser = activeUsers[0];

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        borderColor: firstActiveUser?.userColor,
        boxShadow: firstActiveUser ? `0 0 0 1px ${firstActiveUser.userColor}` : undefined
      }}
      className={cn(
        "group relative flex items-start gap-4 rounded-lg border bg-background p-4 transition-all",
        !isLocked && "hover:bg-accent/50",
        isSelected && !firstActiveUser && "border-primary ring-1 ring-primary/20 bg-accent/20",
        isLocked && "opacity-75 cursor-not-allowed bg-muted/30"
      )}
      onClick={onSelect}
    >
      {/* Remote User / Lock Label */}
      {firstActiveUser && (
        <div
          className="absolute -top-2 left-4 z-10 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm"
          style={{ backgroundColor: firstActiveUser.userColor }}
        >
          {isLocked && <Lock className="h-3 w-3" />}
          {isLocked ? `${lockedBy} is editing` : firstActiveUser.userName}
        </div>
      )}

      <button
        className={cn(
          "mt-3 touch-none text-muted-foreground transition-opacity",
          isLocked ? "cursor-not-allowed opacity-20" : "cursor-grab opacity-50 hover:opacity-100 hover:text-foreground"
        )}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className={cn("flex-1 select-none", isLocked && "pointer-events-none")}>
        <FormFieldRenderer
          field={field}
          value=""
          onChange={() => { }}
        />
      </div>

      {!isLocked && (
        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
