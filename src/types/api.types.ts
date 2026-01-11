/**
 * API Access Types
 */

export interface ApiKey {
    id: string;
    name: string;
    key_prefix: string; // Store first 7 chars for display (e.g. "sk_live...")
    last_used_at: string | null;
    created_at: string;
    is_active: boolean;
}

export interface CreateApiKeyResponse {
    apiKey: ApiKey;
    secretKey: string; // The full key, shown only once
}
