import { formQueriesServer } from "@/lib/forms/queries";
import { submissionQueriesServer } from "@/lib/submissions/queries";
import { getUser } from "@/lib/auth/actions";
import { redirect } from "next/navigation";
import { SubmissionsClient } from "@/components/submissions/submissions-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionsPage({ params }: PageProps) {
  const { id } = await params;

  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  let form;
  try {
    form = await formQueriesServer.getById(id);
  } catch {
    redirect("/dashboard");
  }

  if (!form || form.user_id !== user.id) {
    redirect("/dashboard");
  }

  const submissions = await submissionQueriesServer.getByFormId(id);

  return <SubmissionsClient form={form} submissions={submissions} />;
}
