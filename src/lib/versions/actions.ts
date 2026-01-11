"use server";

import { revalidatePath } from "next/cache";
import { versionService } from "./service";
import { formQueriesServer } from "@/lib/forms/queries";
import type { FormSchema } from "@/types/form.types";
import type { VersionSummary } from "@/types/version.types";

/**
 * Create a new version snapshot of the current form state
 */
export async function createVersionAction(
    formId: string,
    description?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // Get current form schema
        const form = await formQueriesServer.getById(formId);

        if (!form) {
            return { success: false, error: "Form not found" };
        }

        await versionService.create({
            formId,
            schema: form.schema as unknown as FormSchema,
            description,
        });

        revalidatePath(`/editor/${formId}`);
        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create version";
        return { success: false, error: message };
    }
}

/**
 * Get all versions for a form
 */
export async function getVersionsAction(formId: string): Promise<VersionSummary[]> {
    return versionService.list(formId);
}

/**
 * Restore a form to a previous version
 */
export async function restoreVersionAction(
    formId: string,
    versionId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // Get the version to restore
        const version = await versionService.get(versionId);

        if (!version) {
            return { success: false, error: "Version not found" };
        }

        // Create a backup of current state before restoring
        const currentForm = await formQueriesServer.getById(formId);

        if (currentForm) {
            await versionService.create({
                formId,
                schema: currentForm.schema as unknown as FormSchema,
                description: "Auto-backup before restore",
            });
        }

        // Update form with the old version's schema
        await formQueriesServer.update(formId, {
            schema: version.schema as unknown as any,
        });

        revalidatePath(`/editor/${formId}`);
        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to restore version";
        return { success: false, error: message };
    }
}

/**
 * Delete a specific version
 */
export async function deleteVersionAction(
    versionId: string,
    formId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await versionService.delete(versionId);
        revalidatePath(`/editor/${formId}`);
        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete version";
        return { success: false, error: message };
    }
}
