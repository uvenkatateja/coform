"use client";

import { useCallback, useMemo } from "react";
import type { FormSchema, FormField } from "@/types/form.types";
import { createDefaultField } from "@/lib/forms/schema";

type UpdateFn = (form: FormSchema | ((prev: FormSchema) => FormSchema)) => void;

/**
 * Form editor state management hook
 * Separated from realtime logic for clean architecture
 */
export function useFormEditor(
  form: FormSchema,
  updateForm: UpdateFn,
  selectedFieldId: string | null,
  setSelectedFieldId: (id: string | null) => void
) {
  const addField = useCallback((type: FormField["type"]) => {
    const newField = createDefaultField(type);
    updateForm((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
    setSelectedFieldId(newField.id);
  }, [updateForm, setSelectedFieldId]);

  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    updateForm((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    }));
  }, [updateForm]);

  const deleteField = useCallback((id: string) => {
    updateForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== id),
    }));
    setSelectedFieldId(null);
  }, [updateForm, setSelectedFieldId]);

  const reorderFields = useCallback((startIndex: number, endIndex: number) => {
    updateForm((prev) => {
      const fields = Array.from(prev.fields);
      const [removed] = fields.splice(startIndex, 1);
      fields.splice(endIndex, 0, removed);
      return { ...prev, fields };
    });
  }, [updateForm]);

  const selectedField = useMemo(() =>
    form.fields.find((f) => f.id === selectedFieldId),
    [form.fields, selectedFieldId]
  );

  return {
    addField,
    updateField,
    deleteField,
    reorderFields,
    selectedField,
  };
}
