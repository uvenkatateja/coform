"use client";

import { useState, useTransition } from "react";
import { TemplateCard } from "./template-card";
import { createFromTemplateAction } from "@/lib/templates/actions";
import type { FormTemplate } from "@/types/template.types";

interface TemplateGridProps {
    templates: FormTemplate[];
}

/**
 * Template Grid
 * Container component - handles state and actions
 */
export function TemplateGrid({ templates }: TemplateGridProps) {
    const [isPending, startTransition] = useTransition();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelect = (templateId: string) => {
        setSelectedId(templateId);
        startTransition(async () => {
            await createFromTemplateAction(templateId);
        });
    };

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
                <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={handleSelect}
                    loading={isPending && selectedId === template.id}
                />
            ))}
        </div>
    );
}
