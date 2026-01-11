"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Turnstile } from "@marsidev/react-turnstile";
import { FormFieldRenderer } from "./form-field-renderer";
import { CheckCircle2 } from "lucide-react";
import { logicEngine } from "@/lib/logic";
import { calculateQuizScore, type QuizResult as QuizResultType } from "@/lib/quiz/scoring";
import { QuizResult } from "./quiz-result";
import type { FormSchema } from "@/types/form.types";

interface PublicFormClientProps {
  formId: string;
  form: FormSchema;
  onSubmit: (data: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
}

export function PublicFormClient({ formId, form, onSubmit }: PublicFormClientProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [quizResult, setQuizResult] = useState<QuizResultType | null>(null);

  // Validate required fields
  const isValid = useMemo(() => {
    return form.fields
      .filter((f) => f.required)
      .every((f) => formData[f.id] !== undefined && formData[f.id] !== "");
  }, [form.fields, formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid) return;

      setSubmitting(true);
      setError(null);

      // Client-side Honeypot Check
      if (honeypot) {
        setSubmitted(true);
        setSubmitting(false);
        return;
      }

      if (form.settings.security?.turnstileEnabled && !turnstileToken) {
        alert("Please complete the security check.");
        setSubmitting(false);
        return;
      }

      const payload = {
        ...formData,
        _security: {
          honeypot,
          turnstileToken,
        }
      };

      const result = await onSubmit(payload);

      if (result.success) {
        if (form.settings.quiz?.enabled) {
          const score = calculateQuizScore(
            form.fields,
            formData,
            form.settings.quiz.passingScore
          );
          setQuizResult(score);
        }
        setSubmitted(true);
      } else {
        setError(result.error || "Failed to submit form");
      }

      setSubmitting(false);
    },
    [formData, isValid, onSubmit, honeypot, turnstileToken, form.settings, form.fields]
  );

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  // Calculate visible fields
  const visibleFields = useMemo(() => {
    const { hiddenFields } = logicEngine.evaluate(formData, form.logic);
    return form.fields.filter(field => !hiddenFields.has(field.id));
  }, [formData, form.fields, form.logic]);

  // Design Styles
  const design = form.settings.design;
  const containerStyle = design ? {
    backgroundColor: design.colors?.background,
    color: design.colors?.text,
    minHeight: "100vh"
  } : { minHeight: "100vh" };

  const buttonStyle = design?.colors?.primary ? {
    backgroundColor: design.colors.primary,
    color: "#ffffff" // Assume white text for now
  } : {};

  if (submitted) {
    if (quizResult && form.settings.quiz) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4" style={containerStyle}>
          <div className="w-full max-w-md">
            <QuizResult
              result={quizResult}
              settings={form.settings.quiz}
              onRetake={() => {
                setSubmitted(false);
                setQuizResult(null);
                setFormData({});
              }}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4" style={containerStyle}>
        <div className="w-full max-w-md text-center">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h2 className="mb-2 text-2xl font-bold">Thank You!</h2>
          <p className="text-muted-foreground" style={{ color: design?.colors?.text ? `${design.colors.text}aa` : undefined }}>
            {form.settings.successMessage || "Your response has been recorded."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-4 py-8 md:p-8" style={containerStyle}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">{form.title}</h1>
          {form.description && (
            <p className="text-muted-foreground" style={{ color: design?.colors?.text ? `${design.colors.text}aa` : undefined }}>
              {form.description}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {visibleFields.map((field) => (
            <FormFieldRenderer
              key={field.id}
              field={field}
              value={formData[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
              formId={formId}
            />
          ))}

          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div style={{ display: 'none', position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1 }} aria-hidden="true">
            <label htmlFor="_hp_email">Do not fill this out if you are human</label>
            <input
              type="text"
              id="_hp_email"
              name="_hp_email"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {form.settings.security?.turnstileEnabled && (
            <div className="flex justify-start my-4">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                onSuccess={setTurnstileToken}
              />
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={submitting || !isValid}
            className="w-full"
            style={buttonStyle}
          >
            {submitting ? "Submitting..." : form.settings.submitText || "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
