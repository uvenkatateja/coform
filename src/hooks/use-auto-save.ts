"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Debounced auto-save hook
 * Stable callback reference prevents unnecessary re-renders
 */
export function useAutoSave<T>(
  data: T,
  onSave: (data: T) => Promise<void>,
  delay = 2000
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const savedRef = useRef<string>("");
  const onSaveRef = useRef(onSave);

  // Keep callback ref updated without triggering effect
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const save = useCallback(async () => {
    const serialized = JSON.stringify(data);
    // Skip if data hasn't changed
    if (serialized === savedRef.current) return;

    savedRef.current = serialized;
    await onSaveRef.current(data);
  }, [data]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(save, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [save, delay]);
}
