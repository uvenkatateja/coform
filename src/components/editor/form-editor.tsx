"use client";

import { useState, useCallback } from "react";
import { useFormEditor } from "@/hooks/use-form-editor";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useRealtimeForm } from "@/hooks/use-realtime-form";
import { usePresence } from "@/hooks/use-presence";
import { EditorHeader } from "./editor-header";
import { EditorSidebar } from "./editor-sidebar";
import { EditorCanvas } from "./editor-canvas";
import { EditorProperties } from "./editor-properties";
import type { FormSchema, FormField } from "@/types/form.types";

interface FormEditorProps {
  formId: string;
  initialForm: FormSchema;
  isPublic: boolean;
  currentUser: { id: string; name: string };
  onSave?: (schema: FormSchema) => Promise<void>;
  onTogglePublic?: (isPublic: boolean) => Promise<void>;
}

/**
 * Main form editor with real-time collaboration
 * Clean separation: realtime sync → local state → UI
 */
export function FormEditor({
  formId,
  initialForm,
  isPublic,
  currentUser,
  onSave,
  onTogglePublic,
}: FormEditorProps) {
  // Realtime sync handles form state
  const { form, updateLocal, save, isSyncing } = useRealtimeForm(formId, initialForm);

  // Selection state
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Editor operations (uses updateLocal for proper sync)
  const editor = useFormEditor(form, updateLocal, selectedFieldId, setSelectedFieldId);

  // Presence tracking
  const { users } = usePresence(formId, currentUser);

  // Stable save callback for auto-save
  const handleSave = useCallback(async (formToSave: FormSchema) => {
    if (onSave) await onSave(formToSave);
  }, [onSave]);

  // Auto-save with debounce
  useAutoSave(form, handleSave, 2000);

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader
        formId={formId}
        form={form}
        isPublic={isPublic}
        currentUser={currentUser}
        isSyncing={isSyncing}
        activeUsers={users}
        onSave={() => save(form, onSave)}
        onTogglePublic={onTogglePublic}
      />
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <EditorSidebar onAddField={editor.addField} />
        <EditorCanvas
          fields={form.fields}
          selectedId={selectedFieldId}
          onSelect={setSelectedFieldId}
          onUpdate={editor.updateField}
          onDelete={editor.deleteField}
          onReorder={editor.reorderFields}
        />
        <EditorProperties
          field={editor.selectedField}
          onUpdate={(updates: Partial<FormField>) =>
            selectedFieldId && editor.updateField(selectedFieldId, updates)
          }
        />
      </div>
    </div>
  );
}
