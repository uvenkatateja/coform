import { formatDate } from "@/lib/utils";
import type { Database } from "@/types/database.types";

type Submission = Database["public"]["Tables"]["submissions"]["Row"];

interface SubmissionCardProps {
  submission: Submission;
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const data = submission.data as Record<string, any>;

  return (
    <div className="rounded-lg border bg-card p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {formatDate(submission.created_at)}
        </span>
      </div>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <dt className="text-sm font-medium text-muted-foreground">{key}</dt>
            <dd className="mt-1 text-sm">{String(value)}</dd>
          </div>
        ))}
      </div>
    </div>
  );
}
