"use client";

import { Button } from "@/components/ui/button";
import { FIELD_TYPES, FIELD_TYPE_META } from "@/lib/constants/field-types";
import type { FieldType } from "@/types/form.types";

interface EditorSidebarProps {
  onAddField: (type: FieldType) => void;
}

export function EditorSidebar({ onAddField }: EditorSidebarProps) {
  return (
    <aside className="w-full border-b bg-muted/30 p-4 lg:w-64 lg:border-b-0 lg:border-r">
      <h3 className="mb-4 font-semibold">Add Fields</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
        {FIELD_TYPES.map((type) => (
          <Button
            key={type}
            variant="outline"
            className="justify-start"
            onClick={() => onAddField(type)}
          >
            {FIELD_TYPE_META[type].label}
          </Button>
        ))}
      </div>
    </aside>
  );
}
