"use client";

import { useEffect, useRef } from "react";

/**
 * Auto-save hook with debouncing
 * @param data - Data to save
 * @param onSave - Async save callback
 * @param delay - Debounce delay in ms (default: 2000)
 */
export function useAutoSave<T>(
  data: T,
  onSave: (data: T) => Promise<void>,
  delay = 2000
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSave(data);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, delay]);
}
