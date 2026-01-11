"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserPresence } from "@/types/form.types";

/**
 * Real-time presence hook using Supabase Presence
 * Managed as a single state ref to avoid data loss on concurrent updates (cursor vs field)
 */
export function usePresence(formId: string, user: { id: string; name: string }) {
  const [presences, setPresences] = useState<UserPresence[]>([]);
  const channelRef = useRef<any>(null);

  const colors = [
    "#ef4444", "#3b82f6", "#10b981", "#f59e0b",
    "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"
  ];

  const userColor = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < user.id.length; i++) {
      hash = user.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }, [user.id]);

  const presenceState = useRef<Partial<UserPresence>>({
    userId: user.id,
    userName: user.name,
    userColor,
  });

  const syncPresence = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.track({
        ...presenceState.current,
        lastSeen: new Date().toISOString(),
      });
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`presence:${formId}`, {
      config: { presence: { key: user.id } },
    });

    channelRef.current = channel;

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users = Object.values(state).flat() as unknown as UserPresence[];
        setPresences(users);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") syncPresence();
      });

    return () => {
      channel.unsubscribe();
    };
  }, [formId, user.id, syncPresence]);

  useEffect(() => {
    let lastUpdate = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < 60) return;
      lastUpdate = now;

      presenceState.current.cursor = { x: e.clientX, y: e.clientY };
      syncPresence();
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [syncPresence]);

  const setField = useCallback((fieldId: string | null) => {
    presenceState.current.activeFieldId = fieldId || undefined;
    syncPresence();
  }, [syncPresence]);

  return { presences, setField };
}
