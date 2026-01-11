import type { FormLogic } from "./logic.types";

/**
 * Core form field types
 */
export type FieldType =
  | "text"
  | "email"
  | "number"
  | "select"
  | "checkbox"
  | "textarea"
  | "date"
  | "file"
  | "radio";

/**
 * Form field configuration
 */
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  settings?: Record<string, any>;
}

/**
 * Complete form schema
 */
export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  settings: {
    submitText?: string;
    successMessage?: string;
    redirectUrl?: string;
    security?: {
      honeypotEnabled: boolean; // Invisible field trap
      turnstileEnabled: boolean; // Cloudflare CAPTCHA
    };
  };
  logic?: FormLogic; // Conditional logic rules
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/**
 * Form submission data
 */
export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
  ipAddress?: string;
}

/**
 * Real-time collaboration types
 */
export interface UserPresence {
  userId: string;
  userName: string;
  userColor: string;
  cursor?: {
    x: number;
    y: number;
  };
  activeFieldId?: string;
  lastSeen: string;
}

/**
 * Form editor state
 */
export interface EditorState {
  form: FormSchema;
  selectedFieldId: string | null;
  isDragging: boolean;
  activeUsers: UserPresence[];
}
