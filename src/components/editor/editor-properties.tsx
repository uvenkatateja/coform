"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { FormField } from "@/types/form.types";

interface EditorPropertiesProps {
  field?: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

export function EditorProperties({ field, onUpdate }: EditorPropertiesProps) {
  if (!field) {
    return (
      <aside className="hidden w-full border-t bg-muted/30 p-4 lg:block lg:w-80 lg:border-l lg:border-t-0">
        <p className="text-sm text-muted-foreground">
          Select a field to edit properties
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-full border-t bg-muted/30 p-4 lg:w-80 lg:border-l lg:border-t-0">
      <h3 className="mb-4 font-semibold">Field Properties</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="placeholder">Placeholder</Label>
          <Input
            id="placeholder"
            value={field.placeholder || ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="required">Required</Label>
          <Switch
            id="required"
            checked={field.required}
            onCheckedChange={(checked: boolean) => onUpdate({ required: checked })}
          />
        </div>
      </div>
    </aside>
  );
}
