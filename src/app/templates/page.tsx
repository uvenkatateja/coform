import { TemplateGrid } from "@/components/templates/template-grid";
import { templateService } from "@/lib/templates";
import { getUser } from "@/lib/auth/actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function TemplatesPage() {
    const user = await getUser();
    if (!user) redirect("/login");

    const templates = templateService.getAll();

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto flex h-14 items-center gap-4 px-4 md:h-16 md:px-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Back</span>
                        </Link>
                    </Button>
                    <h1 className="text-lg font-semibold md:text-xl">Choose a Template</h1>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8">
                <p className="mb-6 text-muted-foreground">
                    Start with a pre-built template and customize it to your needs
                </p>
                <TemplateGrid templates={templates} />
            </main>
        </div>
    );
}
