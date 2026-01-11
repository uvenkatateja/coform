"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { generateFormWithAIAction } from "@/lib/ai/actions";

// ============================================
// Types
// ============================================

interface AIFormGeneratorProps {
    trigger?: React.ReactNode;
}

// ============================================
// Example Prompts
// ============================================

const EXAMPLE_PROMPTS = [
    "Contact form with name, email, phone, and message",
    "Job application form with resume upload",
    "Event registration with date preferences",
    "Customer feedback survey with ratings",
    "Newsletter signup with interests",
];

// ============================================
// Main Component
// ============================================

export function AIFormGenerator(props: AIFormGeneratorProps): JSX.Element {
    const { trigger } = props;
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    function handleGenerate(): void {
        if (!prompt.trim()) {
            return;
        }

        setError(null);

        startTransition(async () => {
            const result = await generateFormWithAIAction(prompt);

            if (result.success && result.formId) {
                setIsOpen(false);
                setPrompt("");
                router.push(`/editor/${result.formId}`);
            } else {
                setError(result.error || "Failed to generate form");
            }
        });
    }

    function handleExampleClick(example: string): void {
        setPrompt(example);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        Generate with AI
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-primary" />
                        AI Form Generator
                    </DialogTitle>
                    <DialogDescription>
                        Describe the form you want to create and AI will build it for you.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <Textarea
                        placeholder="Describe your form... (e.g., 'A contact form with name, email, and message fields')"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                        disabled={isPending}
                        className="resize-none"
                    />

                    {error && (
                        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Try an example:</p>
                        <div className="flex flex-wrap gap-2">
                            {EXAMPLE_PROMPTS.map((example) => (
                                <button
                                    key={example}
                                    type="button"
                                    onClick={() => handleExampleClick(example)}
                                    disabled={isPending}
                                    className="text-xs px-3 py-1.5 rounded-full border bg-muted/50 hover:bg-muted transition-colors disabled:opacity-50"
                                >
                                    {example.length > 30 ? example.substring(0, 30) + "..." : example}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleGenerate}
                        disabled={isPending || !prompt.trim()}
                        className="gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                Generate Form
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
