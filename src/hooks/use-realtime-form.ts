"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FormSchema } from "@/types/form.types";

/**
 * Real-time form sync with conflict resolution
 * Uses optimistic updates + last-write-wins strategy
 */
export function useRealtimeForm(formId: string, initialForm: FormSchema) {
  const [form, setForm] = useState<FormSchema>(initialForm);
  const [isSyncing, setIsSyncing] = useState(false);
  const localUpdateRef = useRef<number>(0);
  const lastRemoteRef = useRef<number>(0);

  // Subscribe to remote changes
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`form:${formId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "forms",
          filter: `id=eq.${formId}`,
        },
        (payload) => {
          const remoteTime = Date.now();
          // Only apply remote update if no recent local changes
          if (remoteTime - localUpdateRef.current > 500) {
            const updatedForm = payload.new.schema as FormSchema;
            if (updatedForm) {
              lastRemoteRef.current = remoteTime;
              setForm(updatedForm);
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [formId]);

  // Update form locally (marks as local change)
  const updateLocal = useCallback((updater: FormSchema | ((prev: FormSchema) => FormSchema)) => {
    localUpdateRef.current = Date.now();
    setForm(updater);
  }, []);

  // Save to database
  const save = useCallback(async (formToSave: FormSchema, onSave?: (form: FormSchema) => Promise<void>) => {
    if (!onSave) return;

    setIsSyncing(true);
    try {
      await onSave(formToSave);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return { form, updateLocal, save, isSyncing };
}
