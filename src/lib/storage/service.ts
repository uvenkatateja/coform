import { createClient } from "@/lib/supabase/client";
import type { UploadedFile } from "@/types/file.types";

const BUCKET = "form-uploads";

/**
 * Storage Service
 * Backend pattern: Encapsulates Supabase Storage operations
 */
export const storageService = {
    /**
     * Upload file to Supabase Storage
     */
    async upload(file: File, formId: string, fieldId: string): Promise<UploadedFile> {
        const supabase = createClient();

        // Generate unique path
        const ext = file.name.split(".").pop();
        const path = `${formId}/${fieldId}/${Date.now()}.${ext}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET)
            .upload(path, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (error) throw new Error(error.message);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(data.path);

        return {
            id: data.id || path,
            name: file.name,
            size: file.size,
            type: file.type,
            url: publicUrl,
            path: data.path,
        };
    },

    /**
     * Delete file from storage
     */
    async delete(path: string): Promise<void> {
        const supabase = createClient();
        const { error } = await supabase.storage.from(BUCKET).remove([path]);
        if (error) throw new Error(error.message);
    },

    /**
     * Validate file before upload
     */
    validate(file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } {
        const maxBytes = maxSizeMB * 1024 * 1024;

        if (file.size > maxBytes) {
            return { valid: false, error: `File too large. Max size is ${maxSizeMB}MB` };
        }

        return { valid: true };
    },

    /**
     * Format file size for display
     */
    formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    },
};
