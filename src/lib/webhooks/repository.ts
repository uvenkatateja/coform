import { createServerClient } from "@/lib/supabase/server";
import type { Webhook } from "@/types/webhook.types";

/**
 * Webhook Repository
 * Backend pattern: Data access layer
 */
export const webhookRepository = {
    async getByFormId(formId: string): Promise<Webhook[]> {
        const supabase = await createServerClient();
        const { data, error } = await supabase
            .from("webhooks")
            .select("*")
            .eq("form_id", formId)
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        return (data || []) as Webhook[];
    },

    async create(webhook: Omit<Webhook, "id" | "created_at">): Promise<Webhook> {
        const supabase = await createServerClient();
        const { data, error } = await (supabase
            .from("webhooks") as any)
            .insert(webhook)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as Webhook;
    },

    async update(id: string, updates: Partial<Webhook>): Promise<Webhook> {
        const supabase = await createServerClient();
        const { data, error } = await (supabase
            .from("webhooks") as any)
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as Webhook;
    },

    async delete(id: string): Promise<void> {
        const supabase = await createServerClient();
        const { error } = await supabase
            .from("webhooks")
            .delete()
            .eq("id", id);

        if (error) throw new Error(error.message);
    },

    async getActiveByFormId(formId: string): Promise<Webhook[]> {
        const supabase = await createServerClient();
        const { data, error } = await supabase
            .from("webhooks")
            .select("*")
            .eq("form_id", formId)
            .eq("is_active", true);

        if (error) throw new Error(error.message);
        return (data || []) as Webhook[];
    },
};
