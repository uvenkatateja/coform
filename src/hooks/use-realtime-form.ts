"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FormSchema } from "@/types/form.types";
import type { RealtimeChannel } from "@supabase/supabase-js";

/**
 * Real-time form synchronization hook
 * Subscribes to form changes and broadcasts updates
 */
export function useRealtimeForm(formId: string, initialForm: FormSchema) {
  const [form, setForm] = useState<FormSchema>(initialForm);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to form changes via postgres_changes
    const formChannel = supabase
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
          console.log("Realtime update received:", payload);
          const updatedForm = payload.new.schema as FormSchema;
          if (updatedForm) {
            setForm(updatedForm);
            setLastUpdate(Date.now());
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    setChannel(formChannel);

    return () => {
      formChannel.unsubscribe();
    };
  }, [formId]);

  return { form, setForm, channel, lastUpdate };
}
