import type { FormField } from "@/types/form.types";

/**
 * Template definition
 * Backend pattern: Single source of truth for template data
 */
export interface FormTemplate {
    id: string;
    name: string;
    description: string;
    category: TemplateCategory;
    fields: FormField[];
    settings: {
        submitText: string;
        successMessage: string;
    };
}

export type TemplateCategory = "business" | "feedback" | "registration" | "survey" | "other";

/**
 * Template categories metadata
 */
export const TEMPLATE_CATEGORIES: Record<TemplateCategory, { label: string; icon: string }> = {
    business: { label: "Business", icon: "briefcase" },
    feedback: { label: "Feedback", icon: "message-square" },
    registration: { label: "Registration", icon: "user-plus" },
    survey: { label: "Survey", icon: "clipboard-list" },
    other: { label: "Other", icon: "file-text" },
};
