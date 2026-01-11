import { generateId } from "@/lib/utils";
import type { FormSchema, FormField, FieldType } from "@/types/form.types";

/**
 * Create default form schema
 */
export function createDefaultForm(userId: string): FormSchema {
  return {
    id: generateId(),
    title: "Untitled Form",
    description: "",
    fields: [],
    settings: {
      submitText: "Submit",
      successMessage: "Thank you for your submission!",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId,
  };
}

/**
 * Create default field by type
 */
export function createDefaultField(type: FieldType): FormField {
  const baseField: FormField = {
    id: generateId(),
    type,
    label: getDefaultLabel(type),
    required: false,
  };

  // Add type-specific defaults
  if (["select", "checkbox", "radio"].includes(type)) {
    baseField.options = ["Option 1", "Option 2"];
  }

  return baseField;
}

/**
 * Get default label for field type
 */
function getDefaultLabel(type: FieldType): string {
  const labels: Record<FieldType, string> = {
    text: "Text Field",
    email: "Email Address",
    number: "Number",
    select: "Select Option",
    checkbox: "Checkbox",
    textarea: "Long Text",
    date: "Date",
    file: "File Upload",
    radio: "Radio Group",
  };

  return labels[type];
}

/**
 * Validate form schema
 */
export function validateFormSchema(schema: FormSchema): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!schema.title.trim()) {
    errors.push("Form title is required");
  }

  if (schema.fields.length === 0) {
    errors.push("Form must have at least one field");
  }

  schema.fields.forEach((field, index) => {
    if (!field.label.trim()) {
      errors.push(`Field ${index + 1} must have a label`);
    }

    if (["select", "checkbox", "radio"].includes(field.type)) {
      if (!field.options || field.options.length === 0) {
        errors.push(`Field "${field.label}" must have options`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
