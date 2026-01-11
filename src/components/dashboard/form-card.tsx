import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmbedCodeGenerator } from "@/components/embed/embed-code-generator";
import { Trash2, BarChart3, TrendingUp, Settings } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Database } from "@/types/database.types";

type Form = Database["public"]["Tables"]["forms"]["Row"];

interface FormCardProps {
  form: Form;
  onDelete: () => void;
}

export function FormCard({ form, onDelete }: FormCardProps) {
  return (
    <div className="group rounded-lg border bg-card p-4 transition-colors hover:bg-accent md:p-6">
      <Link href={`/editor/${form.id}`} className="block mb-3">
        <h3 className="mb-1 font-semibold group-hover:text-primary">
          {form.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          Updated {formatDate(form.updated_at)}
        </p>
      </Link>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="flex-1"
        >
          <Link href={`/dashboard/forms/${form.id}/submissions`}>
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Responses</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <Link href={`/dashboard/forms/${form.id}/analytics`}>
            <TrendingUp className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <Link href={`/dashboard/forms/${form.id}/settings`}>
            <Settings className="h-4 w-4" />
          </Link>
        </Button>
        {form.is_public && (
          <EmbedCodeGenerator
            formId={form.id}
            baseUrl={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
