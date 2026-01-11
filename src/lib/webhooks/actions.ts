"use server";

import { getUser } from "@/lib/auth/actions";
import { webhookRepository } from "./repository";
import { webhookService } from "./service";
import { revalidatePath } from "next/cache";

/**
 * Webhook Actions
 * Backend pattern: Controller layer
 */

export async function createWebhookAction(formId: string, url: string) {
    const user = await getUser();
    if (!user) throw new Error("Not authenticated");

    const webhook = await webhookRepository.create({
        form_id: formId,
        url,
        events: ["submission.created"],
        secret: webhookService.generateSecret(),
        is_active: true,
    });

    revalidatePath(`/dashboard/forms/${formId}/settings`);
    return webhook;
}

export async function deleteWebhookAction(webhookId: string, formId: string) {
    const user = await getUser();
    if (!user) throw new Error("Not authenticated");

    await webhookRepository.delete(webhookId);
    revalidatePath(`/dashboard/forms/${formId}/settings`);
}

export async function toggleWebhookAction(webhookId: string, formId: string, isActive: boolean) {
    const user = await getUser();
    if (!user) throw new Error("Not authenticated");

    await webhookRepository.update(webhookId, { is_active: isActive });
    revalidatePath(`/dashboard/forms/${formId}/settings`);
}

export async function getWebhooksAction(formId: string) {
    const user = await getUser();
    if (!user) throw new Error("Not authenticated");

    return webhookRepository.getByFormId(formId);
}
