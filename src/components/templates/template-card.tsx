import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, MessageSquare, UserPlus, ClipboardList, FileText } from "lucide-react";
import type { FormTemplate, TemplateCategory } from "@/types/template.types";

interface TemplateCardProps {
    template: FormTemplate;
    onSelect: (templateId: string) => void;
    loading?: boolean;
}

const ICONS: Record<TemplateCategory, React.ReactNode> = {
    business: <Briefcase className="h-5 w-5" />,
    feedback: <MessageSquare className="h-5 w-5" />,
    registration: <UserPlus className="h-5 w-5" />,
    survey: <ClipboardList className="h-5 w-5" />,
    other: <FileText className="h-5 w-5" />,
};

/**
 * Template Card
 * Presentational component - receives data, emits events
 */
export function TemplateCard({ template, onSelect, loading }: TemplateCardProps) {
    return (
        <Card className="group hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-primary">
                    {ICONS[template.category]}
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                </div>
                <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        {template.fields.length} fields
                    </span>
                    <Button
                        size="sm"
                        onClick={() => onSelect(template.id)}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Use Template"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
