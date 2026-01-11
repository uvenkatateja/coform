"use server";


import { aiService } from "./service";
import { formQueriesServer } from "@/lib/forms/queries";
import { getUser } from "@/lib/auth/actions";
import type { AIGenerationResponse } from "@/types/ai.types";

/**
 * Generate a form using AI and save it to the database
 */
export async function generateFormWithAIAction(
    prompt: string,
    organizationId?: string | null
): Promise<{ success: boolean; formId?: string; error?: string }> {
    const user = await getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    // Generate form structure from AI
    const result = await aiService.generateForm(prompt);

    if (!result.success || !result.schema) {
        return { success: false, error: result.error || "Generation failed" };
    }

    // Update schema with user info
    const schema = {
        ...result.schema,
        userId: user.id,
    };

    // Save to database
    try {
        const form = await formQueriesServer.create({
            user_id: user.id,
            organization_id: organizationId || null,
            title: schema.title,
            description: schema.description,
            schema: schema as unknown as any,
            is_public: false,
        });

        return { success: true, formId: form.id };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to save form";
        return { success: false, error: message };
    }
}

/**
 * Preview AI generation without saving (for testing)
 */
export async function previewAIGenerationAction(
    prompt: string
): Promise<AIGenerationResponse> {
    return aiService.generateForm(prompt);
}
