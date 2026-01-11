import { generateId } from "@/lib/utils";
import type { FormSchema } from "@/types/form.types";
import type { FormTemplate } from "@/types/template.types";
import { templateRepository } from "./repository";

/**
 * Template Service
 * Backend pattern: Service layer for business logic
 * Separates business logic from data access
 */
export const templateService = {
    /**
     * Get all templates
     */
    getAll: () => templateRepository.getAll(),

    /**
     * Get template by ID
     */
    getById: (id: string) => templateRepository.getById(id),

    /**
     * Convert template to FormSchema for creating a new form
     */
    toFormSchema: (template: FormTemplate, userId: string): FormSchema => {
        const now = new Date().toISOString();

        // Clone fields with fresh IDs
        const fields = template.fields.map((field) => ({
            ...field,
            id: generateId(),
        }));

        return {
            id: generateId(),
            title: template.name,
            description: template.description,
            fields,
            settings: { ...template.settings },
            createdAt: now,
            updatedAt: now,
            userId,
        };
    },
};
