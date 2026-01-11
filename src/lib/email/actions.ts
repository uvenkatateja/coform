"use server";

import { getUser } from "@/lib/auth/actions";
import { formQueriesServer } from "@/lib/forms/queries";
import { revalidatePath } from "next/cache";

/**
 * Update email notification settings
 */
export async function updateEmailSettingsAction(
    formId: string,
    enabled: boolean,
    emails: string[]
) {
    const user = await getUser();
    if (!user) throw new Error("Not authenticated");

    await formQueriesServer.update(formId, {
        email_notifications_enabled: enabled,
        notification_emails: emails,
    });

    revalidatePath(`/dashboard/forms/${formId}/settings`);
}
