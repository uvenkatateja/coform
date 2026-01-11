"use server";

import { submissionQueriesServer } from "./queries";
import { webhookService } from "@/lib/webhooks/service";
import { emailService } from "@/lib/email/service";
import { formQueriesServer } from "@/lib/forms/queries";
import type { FormSchema } from "@/types/form.types";

export async function submitFormAction(
  formId: string,
  data: Record<string, any>,
  metadata?: { ipAddress?: string; userAgent?: string }
) {
  try {
    // Create submission
    const submission = await submissionQueriesServer.create({
      form_id: formId,
      data,
      ip_address: metadata?.ipAddress,
      user_agent: metadata?.userAgent,
    });

    // Get form for notifications
    const form = await formQueriesServer.getById(formId);
    const schema = form.schema as unknown as FormSchema;

    // Trigger webhooks (fire and forget)
    webhookService.trigger(formId, "submission.created", {
      submission_id: submission.id,
      ...data,
    }).catch(console.error);

    // Send email notifications (fire and forget)
    if (form.email_notifications_enabled && form.notification_emails?.length > 0) {
      emailService.sendSubmissionNotification(
        form.notification_emails,
        {
          formTitle: form.title,
          formId: form.id,
          submissionId: submission.id,
          submittedAt: submission.created_at,
          fields: schema.fields.map((f) => ({
            label: f.label,
            value: String(data[f.id] || ""),
          })),
        }
      ).catch(console.error);
    }

    return { success: true };
  } catch (error) {
    console.error("Submit error:", error);
    return { success: false, error: "Failed to submit form" };
  }
}
