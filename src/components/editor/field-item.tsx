"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FormField } from "@/types/form.types";
import { cn } from "@/lib/utils";
import { FormFieldRenderer } from "@/components/form/form-field-renderer";

interface FieldItemProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
  onDelete: () => void;
}

/**
 * Sortable field item with drag handle and live preview
 */
export function FieldItem({
  field,
  isSelected,
  onSelect,
  onDelete,
}: FieldItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-start gap-4 rounded-lg border bg-background p-4 transition-all hover:bg-accent/50",
        isSelected && "border-primary ring-1 ring-primary/20 bg-accent/20"
      )}
      onClick={onSelect}
    >
      <button
        className="mt-3 cursor-grab touch-none text-muted-foreground hover:text-foreground opacity-50 hover:opacity-100"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex-1 pointer-events-none select-none">
        <FormFieldRenderer
          field={field}
          value=""
          onChange={() => { }}
        />
      </div>

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
    </div>
  );
}
