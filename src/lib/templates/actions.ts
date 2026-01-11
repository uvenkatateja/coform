"use server";

import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/actions";
import { formQueriesServer } from "@/lib/forms/queries";
import { templateService } from "@/lib/templates/service";
import { revalidatePath } from "next/cache";

/**
 * Template Actions
 * Backend pattern: Controller layer for handling requests
 */

/**
 * Create form from template
 */
export async function createFromTemplateAction(templateId: string) {
    // Auth check
    const user = await getUser();
    if (!user) redirect("/login");

    // Get template
    const template = templateService.getById(templateId);
    if (!template) {
        return { error: "Template not found" };
    }

    // Convert to form schema
    const schema = templateService.toFormSchema(template, user.id);

    // Create form in database
    const form = await formQueriesServer.create({
        user_id: user.id,
        title: schema.title,
        description: schema.description,
        schema: schema as any,
        is_public: false,
    });

    // Revalidate dashboard
    revalidatePath("/dashboard");

    // Redirect to editor
    redirect(`/editor/${form.id}`);
}
