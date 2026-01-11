"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Turnstile } from "@marsidev/react-turnstile";
import { FormFieldRenderer } from "./form-field-renderer";
import { CheckCircle2 } from "lucide-react";
import { logicEngine } from "@/lib/logic";
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
        console.log("Bot detected via honeypot");
        setSubmitted(true); // Fake success
        setSubmitting(false);
        return;
      }

      if (form.settings.security?.turnstileEnabled && !turnstileToken) {
        alert("Please complete the security check.");
        setSubmitting(false);
        return;
      }

      // Pass security tokens in a special meta field or spread
      const payload = {
        ...formData,
        _security: {
          honeypot, // Should be empty
          turnstileToken,
        }
      };

      const result = await onSubmit(payload);

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Failed to submit form");
      }

      setSubmitting(false);
    },
    [formData, isValid, onSubmit, honeypot, turnstileToken, form.settings.security?.turnstileEnabled]
  );

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  // Calculate visible fields
  const visibleFields = useMemo(() => {
    const { hiddenFields } = logicEngine.evaluate(formData, form.logic);
    return form.fields.filter(field => !hiddenFields.has(field.id));
  }, [formData, form.fields, form.logic]);

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h2 className="mb-2 text-2xl font-bold">Thank You!</h2>
          <p className="text-muted-foreground">
            {form.settings.successMessage || "Your response has been recorded."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 py-8 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">{form.title}</h1>
          {form.description && (
            <p className="text-muted-foreground">{form.description}</p>
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

          {/* Honeypot Field (Visually Hidden) */}
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

          {/* Turnstile Widget */}
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
          >
            {submitting ? "Submitting..." : form.settings.submitText || "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
