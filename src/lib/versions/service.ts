import { createServerClient } from "@/lib/supabase/server";
import type { FormSchema } from "@/types/form.types";
import type { FormVersion, VersionSummary, CreateVersionInput } from "@/types/version.types";

/**
 * Version Service
 * Handles form versioning operations with explicit, clear functions
 */

/**
 * Get the next version number for a form
 */
async function getNextVersionNumber(formId: string): Promise<number> {
    const supabase = await createServerClient();

    const { data } = await (supabase
        .from("form_versions") as any)
        .select("version")
        .eq("form_id", formId)
        .order("version", { ascending: false })
        .limit(1)
        .single();

    if (!data) {
        return 1;
    }

    return data.version + 1;
}

/**
 * Create a new version snapshot of a form
 */
async function createVersion(input: CreateVersionInput): Promise<FormVersion> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Not authenticated");
    }

    const nextVersion = await getNextVersionNumber(input.formId);

    const { data, error } = await (supabase
        .from("form_versions") as any)
        .insert({
            form_id: input.formId,
            version: nextVersion,
            schema: input.schema,
            description: input.description || null,
            created_by: user.id,
        })
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to create version: ${error.message}`);
    }

    return mapToFormVersion(data);
}

/**
 * List all versions for a form (summaries only)
 */
async function listVersions(formId: string): Promise<VersionSummary[]> {
    const supabase = await createServerClient();

    const { data, error } = await (supabase
        .from("form_versions") as any)
        .select("id, version, created_at, description, schema")
        .eq("form_id", formId)
        .order("version", { ascending: false });

    if (error) {
        throw new Error(`Failed to list versions: ${error.message}`);
    }

    return data.map(mapToVersionSummary);
}

/**
 * Get a specific version by ID
 */
async function getVersion(versionId: string): Promise<FormVersion | null> {
    const supabase = await createServerClient();

    const { data, error } = await (supabase
        .from("form_versions") as any)
        .select("*")
        .eq("id", versionId)
        .single();

    if (error) {
        return null;
    }

    return mapToFormVersion(data);
}

/**
 * Delete a specific version
 */
async function deleteVersion(versionId: string): Promise<void> {
    const supabase = await createServerClient();

    const { error } = await (supabase
        .from("form_versions") as any)
        .delete()
        .eq("id", versionId);

    if (error) {
        throw new Error(`Failed to delete version: ${error.message}`);
    }
}

// ============================================
// Mapping Helpers
// ============================================

function mapToFormVersion(row: any): FormVersion {
    return {
        id: row.id,
        formId: row.form_id,
        version: row.version,
        schema: row.schema as FormSchema,
        createdAt: row.created_at,
        createdBy: row.created_by,
        description: row.description,
    };
}

function mapToVersionSummary(row: any): VersionSummary {
    const schema = row.schema as FormSchema;
    const fieldCount = schema.fields ? schema.fields.length : 0;

    return {
        id: row.id,
        version: row.version,
        createdAt: row.created_at,
        description: row.description,
        fieldCount,
    };
}

// ============================================
// Export as service object
// ============================================

export const versionService = {
    create: createVersion,
    list: listVersions,
    get: getVersion,
    delete: deleteVersion,
};
