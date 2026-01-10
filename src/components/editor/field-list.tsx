"use client";

import type { FormField } from "@/types/form.types";
import { FieldItem } from "./field-item";

interface FieldListProps {
  fields: FormField[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<FormField>) => void;
  onDelete: (id: string) => void;
}

/**
 * Renders list of form fields
 * Composition pattern - delegates rendering to FieldItem
 */
export function FieldList({
  fields,
  selectedId,
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
      {fields.map((field) => (
        <FieldItem
          key={field.id}
          field={field}
          isSelected={field.id === selectedId}
          onSelect={() => onSelect(field.id)}
          onUpdate={(updates) => onUpdate(field.id, updates)}
          onDelete={() => onDelete(field.id)}
        />
      ))}
    </div>
  );
}
