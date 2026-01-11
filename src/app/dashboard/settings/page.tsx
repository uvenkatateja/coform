import { ApiKeySettings } from "@/components/settings/api-key-settings";
import { getApiKeysAction } from "@/lib/api/actions";
import { getUser } from "@/lib/auth/actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
    const user = await getUser();
    if (!user) redirect("/login");

    const apiKeys = await getApiKeysAction();

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto flex h-14 items-center gap-4 px-4 md:h-16 md:px-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Back to Dashboard</span>
                        </Link>
                    </Button>
                    <div className="hidden h-6 w-px bg-border sm:block" />
                    <h1 className="text-lg font-semibold md:text-xl">
                        Account Settings
                    </h1>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8 max-w-4xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>API Access</CardTitle>
                        <CardDescription>
                            Manage API keys to access your form data programmatically.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ApiKeySettings initialKeys={apiKeys} />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
