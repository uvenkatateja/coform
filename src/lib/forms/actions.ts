"use server";

import { revalidatePath } from "next/cache";
import { formQueriesServer } from "./queries";
import type { FormSchema } from "@/types/form.types";

/**
 * Server actions - optimized with revalidation
 */
export async function saveFormAction(formId: string, schema: FormSchema) {
  try {
    await formQueriesServer.update(formId, {
      title: schema.title,
      schema: schema as any
    });
    return { success: true };
  } catch (error) {
    console.error("Save error:", error);
    return { success: false, error: "Failed to save form" };
  }
}

export async function createFormAction(userId: string, title: string) {
  try {
    const form = await formQueriesServer.create({
      user_id: userId,
      title,
      schema: {
        title,
        fields: [],
        settings: {}
      } as any,
    });
    return { success: true, formId: form.id };
  } catch (error) {
    console.error("Create error:", error);
    return { success: false, error: "Failed to create form" };
  }
}

export async function deleteFormAction(formId: string) {
  try {
    await formQueriesServer.delete(formId);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: "Failed to delete form" };
  }
}

export async function togglePublicAction(formId: string, isPublic: boolean) {
  try {
    await formQueriesServer.update(formId, { is_public: isPublic });
    return { success: true };
  } catch (error) {
    console.error("Toggle error:", error);
    return { success: false, error: "Failed to update form" };
  }
}

export async function updateFormSchemaAction(
  formId: string,
  updates: Partial<FormSchema>
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentForm = await formQueriesServer.getById(formId);
    if (!currentForm) {
      return { success: false, error: "Form not found" };
    }

    const currentSchema = currentForm.schema as unknown as FormSchema;
    const newSchema = {
      ...currentSchema,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await formQueriesServer.update(formId, {
      schema: newSchema as unknown as any,
    });

    revalidatePath(`/dashboard/forms/${formId}/settings`);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update settings";
    return { success: false, error: message };
  }
}
