import { FormEditor } from "@/components/editor/form-editor";
import { getFormByShareToken } from "@/lib/forms/collaboration-server";
import { saveFormAction, togglePublicAction } from "@/lib/forms/actions";
import { getUser } from "@/lib/auth/actions";
import { redirect } from "next/navigation";
import type { FormSchema } from "@/types/form.types";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function SharedEditorPage({ params }: PageProps) {
  const { token } = await params;

  const user = await getUser();
  if (!user) {
    // Redirect to login with return URL
    redirect(`/login?redirect=/editor/shared/${token}`);
  }

  let form;
  try {
    form = await getFormByShareToken(token);
  } catch {
    redirect("/dashboard");
  }

  if (!form) {
    redirect("/dashboard");
  }

  const formSchema = form.schema as unknown as FormSchema;
  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  return (
    <FormEditor
      formId={form.id}
      initialForm={formSchema}
      isPublic={form.is_public}
      currentUser={{ id: user.id, name: userName }}
      onSave={async (schema) => {
        "use server";
        await saveFormAction(form.id, schema);
      }}
      onTogglePublic={async (isPublic) => {
        "use server";
        await togglePublicAction(form.id, isPublic);
      }}
    />
  );
}
