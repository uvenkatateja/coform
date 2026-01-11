import { WebhookList } from "@/components/webhooks/webhook-list";
import { getWebhooksAction } from "@/lib/webhooks/actions";
import { formQueriesServer } from "@/lib/forms/queries";
import { getUser } from "@/lib/auth/actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function SettingsPage({ params }: PageProps) {
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

    const webhooks = await getWebhooksAction(id);

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto flex h-14 items-center gap-4 px-4 md:h-16 md:px-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/editor/${id}`}>
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Back to Editor</span>
                        </Link>
                    </Button>
                    <div className="hidden h-6 w-px bg-border sm:block" />
                    <h1 className="text-lg font-semibold md:text-xl truncate">
                        {form.title} - Settings
                    </h1>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Webhooks</CardTitle>
                        <CardDescription>
                            Send submission data to external services
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <WebhookList formId={id} initialWebhooks={webhooks} />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
