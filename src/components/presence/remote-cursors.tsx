"use client";

import { motion } from "framer-motion";
import { MousePointer2 } from "lucide-react";
import type { UserPresence } from "@/types/form.types";

interface RemoteCursorsProps {
    users: UserPresence[];
    currentUserId: string;
}

/**
 * Display real-time cursors of other collaborators
 */
export function RemoteCursors({ users, currentUserId }: RemoteCursorsProps) {
    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {users
                .filter((user) => user.userId !== currentUserId && user.cursor)
                .map((user) => (
                    <motion.div
                        key={user.userId}
                        className="absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap"
                        initial={false}
                        animate={{
                            x: user.cursor!.x,
                            y: user.cursor!.y,
                        }}
                        transition={{
                            type: "spring",
                            damping: 30,
                            mass: 0.5,
                            stiffness: 250,
                        }}
                    >
                        <MousePointer2
                            className="h-5 w-5"
                            style={{
                                fill: user.userColor,
                                color: user.userColor,
                            }}
                        />
                        <span
                            className="rounded px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm"
                            style={{ backgroundColor: user.userColor }}
                        >
                            {user.userName}
                        </span>
                    </motion.div>
                ))}
        </div>
    );
}
