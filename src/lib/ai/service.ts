import type { FormSchema, FormField } from "@/types/form.types";
import type { AIFormStructure, AIFieldStructure, AIGenerationResponse } from "@/types/ai.types";

/**
 * AI Form Generation Service
 * Uses Google Gemini API to generate forms from natural language
 */

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * System prompt that instructs AI how to generate forms
 */
const SYSTEM_PROMPT = `You are a form builder assistant. When given a description of a form, you generate a JSON structure for it.

Rules:
1. Create clear, user-friendly field labels
2. Use appropriate field types: text, email, textarea, number, date, select, checkbox
3. Add helpful placeholders
4. Mark fields as required when it makes sense
5. For select fields, provide reasonable options
6. Keep forms concise (5-10 fields typically)
7. Always include a title and description

Respond ONLY with valid JSON in this exact format:
{
  "title": "Form Title",
  "description": "Brief description",
  "fields": [
    {
      "type": "text|email|textarea|number|date|select|checkbox",
      "label": "Field Label",
      "placeholder": "Placeholder text",
      "required": true|false,
      "options": ["Option 1", "Option 2"] // Only for select type
    }
  ]
}`;

/**
 * Generate a form schema from a natural language prompt
 * Prioritizes Groq (Llama 3) for speed, falls back to Gemini
 */
export async function generateFormFromPrompt(prompt: string): Promise<AIGenerationResponse> {
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (groqKey) {
        return generateWithGroq(prompt, groqKey);
    }

    if (geminiKey) {
        return generateWithGemini(prompt, geminiKey);
    }

    return {
        success: false,
        error: "AI generation is not configured. Please add GROQ_API_KEY or GEMINI_API_KEY to your environment.",
    };
}

async function generateWithGroq(prompt: string, apiKey: string): Promise<AIGenerationResponse> {
    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `Create a form for: ${prompt}` }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) {
            console.error("Groq Error:", await response.text());
            // Fallback to Gemini if configured
            if (process.env.GEMINI_API_KEY) {
                return generateWithGemini(prompt, process.env.GEMINI_API_KEY);
            }
            return { success: false, error: "AI service error" };
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) return { success: false, error: "Empty response from AI" };

        const formStructure = parseAIResponse(content);
        if (!formStructure) return { success: false, error: "Failed to parse form structure" };

        return { success: true, schema: convertToFormSchema(formStructure) };

    } catch (error) {
        console.error("Groq Exception:", error);
        if (process.env.GEMINI_API_KEY) {
            return generateWithGemini(prompt, process.env.GEMINI_API_KEY);
        }
        return { success: false, error: "AI generation failed" };
    }
}

async function generateWithGemini(prompt: string, apiKey: string): Promise<AIGenerationResponse> {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: SYSTEM_PROMPT },
                            { text: `Create a form for: ${prompt}` },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                error: `API error: ${errorData.error?.message || response.statusText}`,
            };
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            return {
                success: false,
                error: "No response from AI",
            };
        }

        const formStructure = parseAIResponse(generatedText);

        if (!formStructure) {
            return {
                success: false,
                error: "Failed to parse AI response",
            };
        }

        const schema = convertToFormSchema(formStructure);

        return {
            success: true,
            schema,
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            error: `Generation failed: ${message}`,
        };
    }
}

/**
 * Parse the AI response text into structured JSON
 */
function parseAIResponse(text: string): AIFormStructure | null {
    try {
        // Extract JSON from the response (handle markdown code blocks)
        let jsonText = text;

        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            jsonText = jsonMatch[1];
        }

        // Clean and parse
        jsonText = jsonText.trim();
        const parsed = JSON.parse(jsonText);

        // Validate structure
        if (!parsed.title || !parsed.fields || !Array.isArray(parsed.fields)) {
            return null;
        }

        return parsed as AIFormStructure;
    } catch {
        return null;
    }
}

/**
 * Convert AI structure to our FormSchema format
 */
function convertToFormSchema(aiForm: AIFormStructure): FormSchema {
    const now = new Date().toISOString();

    const fields: FormField[] = aiForm.fields.map((aiField, index) => {
        return convertAIFieldToFormField(aiField, index);
    });

    return {
        id: crypto.randomUUID(),
        title: aiForm.title,
        description: aiForm.description || "",
        fields,
        settings: {
            submitText: "Submit",
            successMessage: "Thank you for your submission!",
        },
        createdAt: now,
        updatedAt: now,
        userId: "", // Will be set by the action
    };
}

/**
 * Convert a single AI field to FormField format
 */
function convertAIFieldToFormField(aiField: AIFieldStructure, index: number): FormField {
    const baseField = {
        id: crypto.randomUUID(),
        label: aiField.label,
        placeholder: aiField.placeholder || "",
        required: aiField.required,
        order: index,
    };

    // Handle select fields with options
    if (aiField.type === "select" && aiField.options) {
        return {
            ...baseField,
            type: "select",
            options: aiField.options,
        };
    }

    // Map other types directly
    return {
        ...baseField,
        type: aiField.type,
    };
}

export const aiService = {
    generateForm: generateFormFromPrompt,
};
