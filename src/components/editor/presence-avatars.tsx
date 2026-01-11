"use client";

import { memo } from "react";
import type { UserPresence } from "@/types/form.types";

interface PresenceAvatarsProps {
  users: UserPresence[];
  currentUserId: string;
}

/**
 * Display active users as avatars
 * Shows who's currently editing
 */
function PresenceAvatarsComponent({ users, currentUserId }: PresenceAvatarsProps) {
  const otherUsers = users.filter((u) => u.userId !== currentUserId);

  if (otherUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {otherUsers.slice(0, 3).map((user) => (
        <div
          key={user.userId}
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: user.userColor }}
          title={user.userName}
        >
          {user.userName.charAt(0).toUpperCase()}
        </div>
      ))}
      {otherUsers.length > 3 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
          +{otherUsers.length - 3}
        </div>
      )}
    </div>
  );
}

export const PresenceAvatars = memo(PresenceAvatarsComponent);
