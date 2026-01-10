"use server";

import { submissionQueriesServer } from "./queries";

export async function submitFormAction(
  formId: string,
  data: Record<string, any>,
  metadata?: { ipAddress?: string; userAgent?: string }
) {
  try {
    await submissionQueriesServer.create({
      form_id: formId,
      data,
      ip_address: metadata?.ipAddress,
      user_agent: metadata?.userAgent,
    });
    return { success: true };
  } catch (error) {
    console.error("Submit error:", error);
    return { success: false, error: "Failed to submit form" };
  }
}
