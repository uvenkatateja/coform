import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Database } from "@/types/database.types";

type Form = Database["public"]["Tables"]["forms"]["Row"];

interface FormListProps {
  forms: Form[];
}

export function FormList({ forms }: FormListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {forms.map((form) => (
        <Link
          key={form.id}
          href={`/editor/${form.id}`}
          className="group rounded-lg border p-6 transition-colors hover:bg-accent"
        >
          <h3 className="mb-2 font-semibold group-hover:text-primary">
            {form.title}
          </h3>
          {form.description && (
            <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
              {form.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Updated {formatDate(form.updated_at)}
          </p>
        </Link>
      ))}
    </div>
  );
}
