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
