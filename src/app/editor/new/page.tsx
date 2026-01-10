import { getUser } from "@/lib/auth/actions";
import { formQueriesServer } from "@/lib/forms/queries";
import { redirect } from "next/navigation";

export default async function NewEditorPage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/login");
  }
  
  const form = await formQueriesServer.create({
    user_id: user.id,
    title: "Untitled Form",
    schema: { 
      title: "Untitled Form",
      fields: [], 
      settings: {} 
    } as any,
  });
  
  redirect(`/editor/${form.id}`);
}
