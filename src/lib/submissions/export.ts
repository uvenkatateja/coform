import type { Database } from "@/types/database.types";

type Submission = Database["public"]["Tables"]["submissions"]["Row"];

/**
 * Export submissions as CSV
 */
export function exportToCSV(submissions: Submission[]): string {
  if (submissions.length === 0) return "";

  // Get all unique field keys
  const allKeys = new Set<string>();
  submissions.forEach((sub) => {
    const data = sub.data as Record<string, any>;
    Object.keys(data).forEach((key) => allKeys.add(key));
  });

  const headers = ["Submitted At", ...Array.from(allKeys)];

  // Create CSV rows
  const rows = submissions.map((sub) => {
    const data = sub.data as Record<string, any>;
    const timestamp = new Date(sub.created_at).toLocaleString();
    const values = Array.from(allKeys).map((key) => {
      const value = data[key];
      // Escape commas and quotes
      const escaped = String(value || "").replace(/"/g, '""');
      return `"${escaped}"`;
    });
    return [timestamp, ...values].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

/**
 * Export submissions as JSON
 */
export function exportToJSON(submissions: Submission[]): string {
  const formatted = submissions.map((sub) => ({
    id: sub.id,
    submittedAt: sub.created_at,
    data: sub.data,
    ipAddress: sub.ip_address,
  }));

  return JSON.stringify(formatted, null, 2);
}

/**
 * Download file in browser
 */
export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
