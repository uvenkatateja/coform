import type { FormSchema } from "./form.types";

/**
 * AI Form Generation Types
 */

export interface AIGenerationRequest {
    prompt: string;
    context?: string; // Optional additional context
}

export interface AIGenerationResponse {
    success: boolean;
    schema?: FormSchema;
    error?: string;
}

/**
 * Structured output format for AI
 * This is what we ask Gemini to return
 */
export interface AIFormStructure {
    title: string;
    description: string;
    fields: AIFieldStructure[];
}

export interface AIFieldStructure {
    type: "text" | "email" | "textarea" | "number" | "date" | "select" | "checkbox";
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[]; // For select fields
}
