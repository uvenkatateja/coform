"use client";

import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FieldList } from "./field-list";
import type { FormField, UserPresence } from "@/types/form.types";
import { useEffect, useState, useId } from "react";

interface EditorCanvasProps {
  fields: FormField[];
  selectedId: string | null;
  presences: UserPresence[];
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<FormField>) => void;
  onDelete: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

export function EditorCanvas({
  fields,
  selectedId,
  presences,
  onSelect,
  onUpdate,
  onDelete,
  onReorder,
}: EditorCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const dndId = useId();

  // Only render DndContext on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    onReorder(oldIndex, newIndex);
  };

  return (
    <main className="flex-1 overflow-auto p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        {mounted ? (
          <DndContext
            id={dndId}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <FieldList
                fields={fields}
                selectedId={selectedId}
                presences={presences}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            </SortableContext>
          </DndContext>
        ) : (
          <FieldList
            fields={fields}
            selectedId={selectedId}
            presences={presences}
            onSelect={onSelect}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        )}
      </div>
    </main>
  );
}
