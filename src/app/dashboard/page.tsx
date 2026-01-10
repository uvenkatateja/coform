import { formQueriesServer } from "@/lib/forms/queries";
import { getUser } from "@/lib/auth/actions";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  // Check auth
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch forms from database
  const forms = await formQueriesServer.getAll();

  return <DashboardClient forms={forms} />;
}
