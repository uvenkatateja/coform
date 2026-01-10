"use client";

import { useState, useCallback } from "react";
import type { FormSchema, FormField } from "@/types/form.types";
import { createDefaultField } from "@/lib/forms/schema";

/**
 * Form editor state management hook
 * Follows single responsibility principle
 */
export function useFormEditor(initialForm: FormSchema) {
  const [form, setForm] = useState<FormSchema>(initialForm);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const updateForm = useCallback((updates: Partial<FormSchema>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  const addField = useCallback((type: FormField["type"]) => {
    const newField = createDefaultField(type);
    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
    setSelectedFieldId(newField.id);
  }, []);

  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    }));
  }, []);

  const deleteField = useCallback((id: string) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== id),
    }));
    setSelectedFieldId(null);
  }, []);

  const reorderFields = useCallback((startIndex: number, endIndex: number) => {
    setForm((prev) => {
      const fields = Array.from(prev.fields);
      const [removed] = fields.splice(startIndex, 1);
      fields.splice(endIndex, 0, removed);
      return { ...prev, fields };
    });
  }, []);

  return {
    form,
    setForm, // Expose for realtime sync
    selectedFieldId,
    setSelectedFieldId,
    updateForm,
    addField,
    updateField,
    deleteField,
    reorderFields,
  };
}
