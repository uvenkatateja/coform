import { CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { QuizResult as QuizResultType } from "@/lib/quiz/scoring";
import type { FormSchema } from "@/types/form.types";

interface QuizResultProps {
    result: QuizResultType;
    settings: NonNullable<FormSchema["settings"]["quiz"]>;
    onRetake?: () => void;
}

export function QuizResult({ result, settings, onRetake }: QuizResultProps) {
    return (
        <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">
                    {result.passed ? "Congratulations! 🎉" : "Keep Trying! 💪"}
                </h2>
                <p className="text-muted-foreground">
                    You scored {result.score} out of {result.maxScore} points
                </p>
            </div>

            <div className="relative pt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span>Score</span>
                    <span className="font-bold">{result.percentage}%</span>
                </div>
                <Progress
                    value={result.percentage}
                    className={result.passed ? "bg-muted text-green-500" : "bg-muted text-orange-500"}
                />
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border">
                {result.passed ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="h-6 w-6" />
                        <span className="font-semibold">You passed the quiz!</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2 text-orange-600">
                        <XCircle className="h-6 w-6" />
                        <span className="font-semibold">
                            Pass mark: {settings.passingScore || 0} points
                        </span>
                    </div>
                )}
            </div>

            {onRetake && (
                <Button onClick={onRetake} variant="outline" className="w-full">
                    Retake Quiz
                </Button>
            )}
        </div>
    );
}
