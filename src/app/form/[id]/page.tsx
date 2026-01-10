import { formQueriesServer } from "@/lib/forms/queries";
import { submitFormAction } from "@/lib/submissions/actions";
import { PublicFormClient } from "@/components/form/public-form-client";
import { redirect } from "next/navigation";
import type { FormSchema } from "@/types/form.types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicFormPage({ params }: PageProps) {
  const { id } = await params;

  let form;
  try {
    form = await formQueriesServer.getById(id);
  } catch {
    redirect("/");
  }

  if (!form || !form.is_public) {
    redirect("/");
  }

  const formSchema = form.schema as unknown as FormSchema;

  return (
    <PublicFormClient
      form={formSchema}
      onSubmit={async (data) => {
        "use server";
        return await submitFormAction(id, data);
      }}
    />
  );
}
