import type { SubmissionEmailData } from "@/types/email.types";

/**
 * Email Service
 * Backend pattern: Business logic layer
 * Uses fetch to call external email API (Resend, SendGrid, etc.)
 */
export const emailService = {
    /**
     * Send submission notification email
     * Uses Resend API - can be swapped for any provider
     */
    async sendSubmissionNotification(
        to: string[],
        data: SubmissionEmailData
    ): Promise<{ success: boolean; error?: string }> {
        // Skip if no recipients
        if (to.length === 0) return { success: true };

        const apiKey = process.env.RESEND_API_KEY;

        // If no API key, log and skip (development mode)
        if (!apiKey) {
            console.log("[Email] Would send to:", to, "Data:", data);
            return { success: true };
        }

        try {
            const response = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: process.env.EMAIL_FROM || "CoForm <notifications@coform.app>",
                    to,
                    subject: `New submission: ${data.formTitle}`,
                    html: this.generateHtml(data),
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                console.error("[Email] Failed:", error);
                return { success: false, error };
            }

            return { success: true };
        } catch (error) {
            console.error("[Email] Error:", error);
            return { success: false, error: String(error) };
        }
    },

    /**
     * Generate email HTML
     */
    generateHtml(data: SubmissionEmailData): string {
        const fieldsHtml = data.fields
            .map(
                (f) => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: 500;">${f.label}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${f.value || "-"}</td>
        </tr>
      `
            )
            .join("");

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="background: #18181b; color: white; padding: 20px;">
            <h1 style="margin: 0; font-size: 18px;">New Submission</h1>
            <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">${data.formTitle}</p>
          </div>
          <div style="padding: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              ${fieldsHtml}
            </table>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Submitted at ${new Date(data.submittedAt).toLocaleString()}
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/forms/${data.formId}/submissions" 
               style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #18181b; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">
              View All Submissions
            </a>
          </div>
        </div>
      </body>
      </html>
    `;
    },
};
