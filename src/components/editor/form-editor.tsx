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
import { LogicBuilder } from "@/components/logic/logic-builder";
import { VersionHistory } from "@/components/versions/version-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getVersionsAction } from "@/lib/versions/actions";
import type { FormSchema, FormField } from "@/types/form.types";
import type { VersionSummary } from "@/types/version.types";

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

  // Version history (lazy loaded)
  const [versions, setVersions] = useState<VersionSummary[]>([]);
  const [versionsLoaded, setVersionsLoaded] = useState(false);

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

  // Load versions when History tab is selected
  async function loadVersions(): Promise<void> {
    if (versionsLoaded) return;

    const data = await getVersionsAction(formId);
    setVersions(data);
    setVersionsLoaded(true);
  }

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
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="build" className="h-full flex flex-col">
          <div className="border-b px-4 bg-background">
            <TabsList>
              <TabsTrigger value="build">Build</TabsTrigger>
              <TabsTrigger value="logic">Logic</TabsTrigger>
              <TabsTrigger value="history" onClick={loadVersions}>History</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="build" className="flex-1 mt-0 h-full">
            <div className="flex h-full flex-col lg:flex-row">
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
          </TabsContent>

          <TabsContent value="logic" className="flex-1 mt-0 p-6 overflow-auto bg-muted/50">
            <div className="max-w-4xl mx-auto">
              <LogicBuilder
                fields={form.fields}
                logic={form.logic || { rules: [] }}
                onChange={(logic) => updateLocal({ ...form, logic })}
              />
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-1 mt-0 p-6 overflow-auto bg-muted/50">
            <div className="max-w-4xl mx-auto">
              <VersionHistory formId={formId} initialVersions={versions} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
