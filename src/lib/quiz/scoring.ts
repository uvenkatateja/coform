import type { FormField } from "@/types/form.types";

export interface QuizResult {
    score: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
    fieldResults: Record<string, boolean>; // fieldId -> isCorrect
}

/**
 * Calculates the score for a single field
 */
export function calculateFieldScore(
    field: FormField,
    value: any
): { isCorrect: boolean; points: number } {
    const quizConfig = field.quiz;

    // If no quiz config or no correct answer set, skip (0 points, not counted)
    if (!quizConfig || !quizConfig.correctAnswer) {
        return { isCorrect: false, points: 0 };
    }

    const points = quizConfig.points || 1;
    const isCorrect = String(value) === String(quizConfig.correctAnswer);

    return {
        isCorrect,
        points: isCorrect ? points : 0
    };
}

/**
 * Calculates the total quiz score
 * 
 * @param fields Form fields definition
 * @param data Submission data
 * @param passingScore Optional passing threshold
 */
export function calculateQuizScore(
    fields: FormField[],
    data: Record<string, any>,
    passingScore: number = 0
): QuizResult {
    let score = 0;
    let maxScore = 0;
    const fieldResults: Record<string, boolean> = {};

    for (const field of fields) {
        // Only score fields that have a defined correct answer
        if (field.quiz?.correctAnswer) {
            const fieldMaxPoints = field.quiz.points || 1;
            const result = calculateFieldScore(field, data[field.id]);

            maxScore += fieldMaxPoints;
            score += result.points;
            fieldResults[field.id] = result.isCorrect;
        }
    }

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const passed = maxScore > 0 ? score >= passingScore : true;

    return {
        score,
        maxScore,
        percentage,
        passed,
        fieldResults
    };
}
