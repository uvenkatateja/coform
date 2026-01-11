"use client";

import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUploadField } from "./file-upload-field";
import type { FormField } from "@/types/form.types";

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  formId?: string;
}

function FormFieldRendererComponent({ field, value, onChange, formId }: FormFieldRendererProps) {
  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            rows={4}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );

      case "select":
        return (
          <Select value={value} onValueChange={onChange} required={field.required}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value || false}
              onCheckedChange={onChange}
              required={field.required}
            />
            <Label className="text-sm font-normal">{field.placeholder}</Label>
          </div>
        );

      case "file":
        return formId ? (
          <FileUploadField
            formId={formId}
            fieldId={field.id}
            value={value}
            onChange={onChange}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </Label>
      {renderField()}
    </div>
  );
}

export const FormFieldRenderer = memo(FormFieldRendererComponent);
