"use client";

import { useFormEditor } from "@/hooks/use-form-editor";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useRealtimeForm } from "@/hooks/use-realtime-form";
import { EditorHeader } from "./editor-header";
import { EditorSidebar } from "./editor-sidebar";
import { EditorCanvas } from "./editor-canvas";
import { EditorProperties } from "./editor-properties";
import type { FormSchema, FormField } from "@/types/form.types";
import { useEffect, useRef } from "react";

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
 * Optimized: Realtime sync, minimal re-renders, fast updates
 */
export function FormEditor({
  formId,
  initialForm,
  isPublic,
  currentUser,
  onSave,
  onTogglePublic,
}: FormEditorProps) {
  const editor = useFormEditor(initialForm);
  const { form: realtimeForm, lastUpdate } = useRealtimeForm(formId, initialForm);
  const lastSyncRef = useRef<number>(0);

  // Sync realtime changes to editor (only when remote update is newer)
  useEffect(() => {
    if (lastUpdate > lastSyncRef.current) {
      console.log("Syncing realtime form to editor");
      editor.setForm(realtimeForm);
      lastSyncRef.current = lastUpdate;
    }
  }, [realtimeForm, lastUpdate]);

  // Auto-save with optimistic updates
  useAutoSave(editor.form, async (form: FormSchema) => {
    if (onSave) await onSave(form);
  });

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader
        formId={formId}
        form={editor.form}
        isPublic={isPublic}
        currentUser={currentUser}
        onSave={async () => {
          if (onSave) await onSave(editor.form);
        }}
        onTogglePublic={async (pub) => {
          if (onTogglePublic) await onTogglePublic(pub);
        }}
      />
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <EditorSidebar onAddField={editor.addField} />
        <EditorCanvas
          fields={editor.form.fields}
          selectedId={editor.selectedFieldId}
          onSelect={editor.setSelectedFieldId}
          onUpdate={editor.updateField}
          onDelete={editor.deleteField}
          onReorder={editor.reorderFields}
        />
        <EditorProperties
          field={editor.form.fields.find((f) => f.id === editor.selectedFieldId)}
          onUpdate={(updates: Partial<FormField>) =>
            editor.selectedFieldId &&
            editor.updateField(editor.selectedFieldId, updates)
          }
        />
      </div>
    </div>
  );
}
