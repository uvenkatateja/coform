"use server";

import { submissionQueriesServer } from "./queries";
import { webhookService } from "@/lib/webhooks/service";
import { emailService } from "@/lib/email/service";
import { formQueriesServer } from "@/lib/forms/queries";
import { securityService } from "@/lib/security/service";
import type { FormSchema } from "@/types/form.types";

export async function submitFormAction(
  formId: string,
  data: Record<string, any>,
  metadata?: { ipAddress?: string; userAgent?: string }
) {
  try {
    // Get form and check security settings
    const form = await formQueriesServer.getById(formId);
    if (!form) throw new Error("Form not found");

    const schema = form.schema as unknown as FormSchema;
    const securitySettings = schema.settings?.security;

    // Separate security data from form data
    const { _security, ...cleanData } = data;

    // 1. Honeypot Check (Server-side backup)
    if (_security?.honeypot) {
      console.log("Submit blocked: Honeypot filled");
      return { success: true }; // Silent rejection (fake success)
    }

    // 2. Turnstile Check
    if (securitySettings?.turnstileEnabled) {
      if (!_security?.turnstileToken) {
        return { success: false, error: "Security check failed: No token provided" };
      }

      const isValid = await securityService.verifyTurnstile(_security.turnstileToken);
      if (!isValid) {
        return { success: false, error: "Security check failed: Invalid token" };
      }
    }

    // Create submission
    const submission = await submissionQueriesServer.create({
      form_id: formId,
      data: cleanData,
      ip_address: metadata?.ipAddress,
      user_agent: metadata?.userAgent,
    });

    // Trigger webhooks (fire and forget)
    webhookService.trigger(formId, "submission.created", {
      submission_id: submission.id,
      ...cleanData,
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
            value: String(cleanData[f.id] || ""),
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
