import { formQueriesServer } from "@/lib/forms/queries";
import { getUserOrganizationsAction } from "@/lib/organizations/actions";
import { getUser } from "@/lib/auth/actions";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

interface DashboardPageProps {
  searchParams: Promise<{ orgId?: string }>;
}

export default async function DashboardPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  const currentOrgId = searchParams.orgId || null;

  // Check auth
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  // Parallel fetch: Forms + Organizations
  const [forms, organizations] = await Promise.all([
    formQueriesServer.getAll(currentOrgId),
    getUserOrganizationsAction(),
  ]);

  return (
    <DashboardClient
      forms={forms}
      organizations={organizations}
      currentOrgId={currentOrgId}
    />
  );
}
