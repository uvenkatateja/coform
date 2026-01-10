"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface UserPresence {
  userId: string;
  userName: string;
  userColor: string;
  timestamp: number;
}

/**
 * Track active users in real-time
 * Shows who's currently editing the form
 */
export function usePresence(formId: string, currentUser: { id: string; name: string }) {
  const [users, setUsers] = useState<UserPresence[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const userColor = generateColor(currentUser.id);

    const presenceChannel = supabase.channel(`presence:${formId}`, {
      config: { presence: { key: currentUser.id } },
    });

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        const activeUsers = Object.values(state)
          .flat()
          .map((user: any) => ({
            userId: user.userId,
            userName: user.userName,
            userColor: user.userColor,
            timestamp: user.timestamp,
          }));
        setUsers(activeUsers);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({
            userId: currentUser.id,
            userName: currentUser.name,
            userColor,
            timestamp: Date.now(),
          });
        }
      });

    setChannel(presenceChannel);

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [formId, currentUser.id, currentUser.name]);

  return { users, channel };
}

/**
 * Generate consistent color for user
 */
function generateColor(userId: string): string {
  const colors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#ec4899", // pink
  ];
  const hash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
