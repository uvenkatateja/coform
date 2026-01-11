import type { FieldType } from "@/types/form.types";

/**
 * Available field types for Week 1-4 MVP
 */
export const FIELD_TYPES: readonly FieldType[] = [
  "text",
  "email",
  "number",
  "textarea",
  "date",
  "select",
  "checkbox",
  "file",
  "radio",
] as const;

/**
 * Field type metadata
 */
export const FIELD_TYPE_META: Record<
  FieldType,
  { label: string; description: string }
> = {
  text: {
    label: "Text",
    description: "Single line text input",
  },
  email: {
    label: "Email",
    description: "Email address input",
  },
  number: {
    label: "Number",
    description: "Numeric input",
  },
  textarea: {
    label: "Textarea",
    description: "Multi-line text",
  },
  date: {
    label: "Date",
    description: "Date picker",
  },
  select: {
    label: "Select",
    description: "Dropdown selection",
  },
  checkbox: {
    label: "Checkbox",
    description: "Multiple choice",
  },
  file: {
    label: "File",
    description: "File upload",
  },
  radio: {
    label: "Radio Group",
    description: "Single choice selection",
  },
};
