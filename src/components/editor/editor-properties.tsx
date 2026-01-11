"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
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

  const hasOptions = ["select", "radio", "checkbox"].includes(field.type);

  const addOption = () => {
    const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
    onUpdate({ options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = [...(field.options || [])];
    newOptions.splice(index, 1);
    onUpdate({ options: newOptions });
  };

  return (
    <aside className="w-full border-t bg-muted/30 p-4 lg:w-80 lg:border-l lg:border-t-0 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <h3 className="mb-4 font-semibold">Field Properties</h3>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
          />
        </div>

        <div className="space-y-2">
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

        {hasOptions && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button size="sm" variant="outline" onClick={addOption} className="h-7 px-2">
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="h-8"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeOption(index)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {(!field.options || field.options.length === 0) && (
                <p className="text-xs text-muted-foreground italic">No options added</p>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
