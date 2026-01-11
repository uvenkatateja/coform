import type { FormSchema } from "./form.types";

/**
 * Represents a saved snapshot of a form at a point in time
 */
export interface FormVersion {
    id: string;
    formId: string;
    version: number;
    schema: FormSchema;
    createdAt: string;
    createdBy: string | null;
    description: string | null;
}

/**
 * Data required to create a new version
 */
export interface CreateVersionInput {
    formId: string;
    schema: FormSchema;
    description?: string;
}

/**
 * Summary view of a version (for lists)
 */
export interface VersionSummary {
    id: string;
    version: number;
    createdAt: string;
    description: string | null;
    fieldCount: number;
}
