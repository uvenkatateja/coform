import type { FormTemplate } from "@/types/template.types";
import { generateId } from "@/lib/utils";

/**
 * Template Repository
 * Backend pattern: Repository pattern for data access
 * All templates defined in one place - easy to extend
 */

const createField = (
    type: "text" | "email" | "number" | "textarea" | "date" | "select" | "checkbox",
    label: string,
    options?: { required?: boolean; placeholder?: string; options?: string[] }
) => ({
    id: generateId(),
    type,
    label,
    required: options?.required ?? false,
    placeholder: options?.placeholder,
    options: options?.options,
});

/**
 * Pre-built form templates
 */
export const TEMPLATES: FormTemplate[] = [
    {
        id: "contact",
        name: "Contact Form",
        description: "Simple contact form with name, email, and message",
        category: "business",
        fields: [
            createField("text", "Full Name", { required: true, placeholder: "John Doe" }),
            createField("email", "Email Address", { required: true, placeholder: "john@example.com" }),
            createField("text", "Subject", { placeholder: "How can we help?" }),
            createField("textarea", "Message", { required: true, placeholder: "Your message..." }),
        ],
        settings: {
            submitText: "Send Message",
            successMessage: "Thank you! We'll get back to you soon.",
        },
    },
    {
        id: "feedback",
        name: "Feedback Form",
        description: "Collect feedback from customers or users",
        category: "feedback",
        fields: [
            createField("email", "Email (optional)", { placeholder: "your@email.com" }),
            createField("select", "How would you rate us?", {
                required: true,
                options: ["Excellent", "Good", "Average", "Poor"]
            }),
            createField("textarea", "What did you like?", { placeholder: "Tell us what went well..." }),
            createField("textarea", "What can we improve?", { placeholder: "Your suggestions..." }),
            createField("checkbox", "I would recommend to others"),
        ],
        settings: {
            submitText: "Submit Feedback",
            successMessage: "Thank you for your feedback!",
        },
    },
    {
        id: "event-registration",
        name: "Event Registration",
        description: "Register attendees for events or webinars",
        category: "registration",
        fields: [
            createField("text", "Full Name", { required: true }),
            createField("email", "Email Address", { required: true }),
            createField("text", "Company", { placeholder: "Your company name" }),
            createField("text", "Job Title", { placeholder: "Your role" }),
            createField("select", "How did you hear about us?", {
                options: ["Social Media", "Friend/Colleague", "Search Engine", "Email", "Other"],
            }),
            createField("checkbox", "I agree to receive updates"),
        ],
        settings: {
            submitText: "Register",
            successMessage: "You're registered! Check your email for confirmation.",
        },
    },
    {
        id: "survey",
        name: "Customer Survey",
        description: "General purpose survey template",
        category: "survey",
        fields: [
            createField("select", "How satisfied are you with our service?", {
                required: true,
                options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
            }),
            createField("select", "How likely are you to recommend us?", {
                required: true,
                options: ["Very Likely", "Likely", "Neutral", "Unlikely", "Very Unlikely"],
            }),
            createField("textarea", "Any additional comments?", { placeholder: "Share your thoughts..." }),
            createField("email", "Email (optional)", { placeholder: "For follow-up" }),
        ],
        settings: {
            submitText: "Submit Survey",
            successMessage: "Thank you for completing our survey!",
        },
    },
    {
        id: "job-application",
        name: "Job Application",
        description: "Basic job application form",
        category: "business",
        fields: [
            createField("text", "Full Name", { required: true }),
            createField("email", "Email Address", { required: true }),
            createField("text", "Phone Number", { placeholder: "+1 (555) 000-0000" }),
            createField("text", "Position Applied For", { required: true }),
            createField("textarea", "Why are you interested in this role?", { required: true }),
            createField("textarea", "Relevant Experience", { placeholder: "Briefly describe your experience..." }),
            createField("date", "Available Start Date"),
        ],
        settings: {
            submitText: "Submit Application",
            successMessage: "Application received! We'll review and get back to you.",
        },
    },
];

/**
 * Repository methods
 */
export const templateRepository = {
    getAll: () => TEMPLATES,

    getById: (id: string) => TEMPLATES.find((t) => t.id === id),

    getByCategory: (category: string) =>
        TEMPLATES.filter((t) => t.category === category),
};
