"use server";

import { submissionQueriesServer } from "./queries";
import { webhookService } from "@/lib/webhooks/service";

export async function submitFormAction(
  formId: string,
  data: Record<string, any>,
  metadata?: { ipAddress?: string; userAgent?: string }
) {
  try {
    const submission = await submissionQueriesServer.create({
      form_id: formId,
      data,
      ip_address: metadata?.ipAddress,
      user_agent: metadata?.userAgent,
    });

    // Trigger webhooks (fire and forget - non-blocking)
    webhookService.trigger(formId, "submission.created", {
      submission_id: submission.id,
      ...data,
    }).catch(console.error);

    return { success: true };
  } catch (error) {
    console.error("Submit error:", error);
    return { success: false, error: "Failed to submit form" };
  }
}
