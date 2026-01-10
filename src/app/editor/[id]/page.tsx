import { FormEditor } from "@/components/editor/form-editor";
import { formQueriesServer } from "@/lib/forms/queries";
import { saveFormAction, togglePublicAction } from "@/lib/forms/actions";
import { getUser } from "@/lib/auth/actions";
import { redirect } from "next/navigation";
import type { FormSchema } from "@/types/form.types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: PageProps) {
  const { id } = await params;

  const user = await getUser();
  if (!user) redirect("/login");

  let form;
  try {
    form = await formQueriesServer.getById(id);
  } catch {
    redirect("/dashboard");
  }

  if (!form) redirect("/dashboard");

  const formSchema = form.schema as unknown as FormSchema;
  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  return (
    <FormEditor
      formId={id}
      initialForm={formSchema}
      isPublic={form.is_public}
      currentUser={{ id: user.id, name: userName }}
      onSave={async (schema) => {
        "use server";
        await saveFormAction(id, schema);
      }}
      onTogglePublic={async (isPublic) => {
        "use server";
        await togglePublicAction(id, isPublic);
      }}
    />
  );
}
