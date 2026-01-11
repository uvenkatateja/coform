"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FormFieldRenderer } from "@/components/form/form-field-renderer";
import { logicEngine } from "@/lib/logic";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { FormSchema } from "@/types/form.types";

// ============================================
// Types
// ============================================

interface EmbedFormClientProps {
    formId: string;
    form: FormSchema;
    onSubmit: (data: Record<string, unknown>) => Promise<{ success: boolean; error?: string }>;
}

type FormState = "idle" | "submitting" | "success" | "error";

// ============================================
// Main Component
// ============================================

export function EmbedFormClient(props: EmbedFormClientProps): JSX.Element {
    const { formId, form, onSubmit } = props;

    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [formState, setFormState] = useState<FormState>("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Calculate visible fields based on logic rules
    const visibleFields = useMemo(() => {
        const { hiddenFields } = logicEngine.evaluate(formData, form.logic);
        return form.fields.filter((field) => !hiddenFields.has(field.id));
    }, [formData, form.fields, form.logic]);

    const handleFieldChange = useCallback((fieldId: string, value: unknown): void => {
        setFormData((prev) => ({ ...prev, [fieldId]: value }));
    }, []);

    async function handleSubmit(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setFormState("submitting");
        setErrorMessage("");

        const result = await onSubmit(formData);

        if (result.success) {
            setFormState("success");
            notifyParentWindow("form_submitted", { formId });
        } else {
            setFormState("error");
            setErrorMessage(result.error || "Submission failed");
        }
    }

    // Render based on form state
    if (formState === "success") {
        return renderSuccessState(form);
    }

    return (
        <div className="embed-form">
            <style>{getEmbedStyles()}</style>

            <form onSubmit={handleSubmit} className="embed-form__container">
                <header className="embed-form__header">
                    <h1 className="embed-form__title">{form.title}</h1>
                    {form.description && (
                        <p className="embed-form__description">{form.description}</p>
                    )}
                </header>

                <div className="embed-form__fields">
                    {visibleFields.map((field) => (
                        <FormFieldRenderer
                            key={field.id}
                            field={field}
                            value={formData[field.id]}
                            onChange={(value) => handleFieldChange(field.id, value)}
                            formId={formId}
                        />
                    ))}
                </div>

                {formState === "error" && (
                    <div className="embed-form__error">
                        {errorMessage}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="embed-form__submit"
                >
                    {formState === "submitting" ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Submitting...
                        </>
                    ) : (
                        form.settings.submitText || "Submit"
                    )}
                </Button>
            </form>
        </div>
    );
}

// ============================================
// Helper Functions
// ============================================

function renderSuccessState(form: FormSchema): JSX.Element {
    return (
        <div className="embed-form">
            <style>{getEmbedStyles()}</style>
            <div className="embed-form__success">
                <CheckCircle2 className="embed-form__success-icon" />
                <h2 className="embed-form__success-title">Thank You!</h2>
                <p className="embed-form__success-message">
                    {form.settings.successMessage || "Your response has been recorded."}
                </p>
            </div>
        </div>
    );
}

function notifyParentWindow(eventType: string, data: Record<string, unknown>): void {
    if (typeof window === "undefined") {
        return;
    }

    // Send message to parent window (for script-based embeds)
    window.parent.postMessage(
        { type: `coform:${eventType}`, ...data },
        "*"
    );
}

function getEmbedStyles(): string {
    return `
    .embed-form {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 100%;
      padding: 1rem;
      box-sizing: border-box;
    }
    
    .embed-form__container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .embed-form__header {
      margin-bottom: 0.5rem;
    }
    
    .embed-form__title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #111;
    }
    
    .embed-form__description {
      font-size: 0.875rem;
      color: #666;
      margin: 0;
    }
    
    .embed-form__fields {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .embed-form__error {
      padding: 0.75rem 1rem;
      background: #fef2f2;
      color: #dc2626;
      border-radius: 0.5rem;
      font-size: 0.875rem;
    }
    
    .embed-form__submit {
      width: 100%;
    }
    
    .embed-form__success {
      text-align: center;
      padding: 3rem 1rem;
    }
    
    .embed-form__success-icon {
      width: 4rem;
      height: 4rem;
      color: #22c55e;
      margin: 0 auto 1rem;
    }
    
    .embed-form__success-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    }
    
    .embed-form__success-message {
      color: #666;
      margin: 0;
    }
  `;
}
