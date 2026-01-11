import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { analyticsService } from "@/lib/analytics";
import { formQueriesServer } from "@/lib/forms/queries";
import { submissionQueriesServer } from "@/lib/submissions/queries";
import { getUser } from "@/lib/auth/actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import type { FormSchema } from "@/types/form.types";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AnalyticsPage({ params }: PageProps) {
    const { id } = await params;

    // Auth check
    const user = await getUser();
    if (!user) redirect("/login");

    // Fetch form and submissions
    let form;
    try {
        form = await formQueriesServer.getById(id);
    } catch {
        redirect("/dashboard");
    }

    if (!form) redirect("/dashboard");

    const submissions = await submissionQueriesServer.getByFormId(id);
    const formSchema = form.schema as unknown as FormSchema;

    // Calculate analytics
    const analytics = analyticsService.calculate(submissions, formSchema);

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto flex h-14 items-center justify-between px-4 md:h-16 md:px-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Back</span>
                            </Link>
                        </Button>
                        <div className="hidden h-6 w-px bg-border sm:block" />
                        <h1 className="text-lg font-semibold md:text-xl truncate max-w-[200px] sm:max-w-none">
                            {form.title} - Analytics
                        </h1>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/forms/${id}/submissions`}>
                            <FileText className="h-4 w-4" />
                            <span className="hidden sm:inline">View Submissions</span>
                        </Link>
                    </Button>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8">
                {submissions.length === 0 ? (
                    <div className="rounded-lg border p-8 text-center md:p-12">
                        <p className="text-muted-foreground mb-4">
                            No submissions yet. Share your form to start collecting responses.
                        </p>
                        <Button asChild>
                            <Link href={`/editor/${id}`}>Edit Form</Link>
                        </Button>
                    </div>
                ) : (
                    <AnalyticsDashboard analytics={analytics} />
                )}
            </main>
        </div>
    );
}
