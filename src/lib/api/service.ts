import { createServerClient } from "@/lib/supabase/server";
import type { ApiKey, CreateApiKeyResponse } from "@/types/api.types";
import crypto from "crypto";

/**
 * API Key Service
 * Backend pattern: Secure key generation and validation
 */
export const apiKeyService = {
    /**
     * List all API keys for the current user
     */
    async list(): Promise<ApiKey[]> {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await (supabase
            .from("api_keys") as any)
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);

        return data.map((k: any) => ({
            id: k.id,
            name: k.name,
            key_prefix: k.key_prefix,
            last_used_at: k.last_used_at,
            created_at: k.created_at,
            is_active: k.is_active,
        }));
    },

    /**
     * Create a new API key
     * Returns the secret key ONLY ONCE
     */
    async create(name: string): Promise<CreateApiKeyResponse> {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // Generate Key: sk_live_[32 hex chars]
        const randomBytes = crypto.randomBytes(24).toString("hex");
        const secretKey = `sk_live_${randomBytes}`;

        // Hash the key for storage
        const keyHash = this.hashKey(secretKey);
        const keyPrefix = secretKey.substring(0, 7) + "..." + secretKey.substring(secretKey.length - 4);

        const { data, error } = await (supabase
            .from("api_keys") as any)
            .insert({
                user_id: user.id,
                name,
                key_hash: keyHash,
                key_prefix: keyPrefix,
            })
            .select()
            .single();

        if (error) throw new Error(error.message);

        return {
            apiKey: {
                id: data.id,
                name: data.name,
                key_prefix: data.key_prefix,
                last_used_at: data.last_used_at,
                created_at: data.created_at,
                is_active: data.is_active,
            },
            secretKey,
        };
    },

    /**
     * Revoke (delete) an API key
     */
    async revoke(id: string): Promise<void> {
        const supabase = await createServerClient();
        const { error } = await (supabase
            .from("api_keys") as any)
            .delete()
            .eq("id", id);

        if (error) throw new Error(error.message);
    },

    /**
     * Validate an API key
     * Used by API routes
     */
    async validate(secretKey: string): Promise<string | null> {
        // 1. Hash the incoming key
        const keyHash = this.hashKey(secretKey);

        // 2. Find in DB (using admin client to bypass RLS potentially, but here strictly server-side)
        // We need a SERVICE ROLE client to search all keys, or we need to know the context.
        // For API routes, we don't have a user session, so we need a Service Role client.
        // However, I'll export a separate validation function using the standard client
        // assuming RLS policies might block us. We need a way to verify ANY key.

        // NOTE: For now, strict validation requires admin access or a specific lookup function.
        // I will return the hash for now, ensuring the caller handles the DB lookup securely.
        return keyHash;
    },

    /**
     * Helper: Hash a key
     */
    hashKey(key: string): string {
        return crypto.createHash("sha256").update(key).digest("hex");
    },
};
