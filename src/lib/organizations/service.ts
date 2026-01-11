import { createServerClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/actions";
import type { Organization, OrganizationWithRole, CreateOrganizationInput } from "@/types/organization.types";

export const organizationService = {
    /**
     * List all organizations the current user belongs to
     */
    async listUserOrganizations(): Promise<OrganizationWithRole[]> {
        const supabase = await createServerClient() as any;
        const user = await getUser();

        if (!user) return [];

        const { data, error } = await supabase
            .from("organization_members")
            .select(`
        role,
        organization:organizations (*)
      `)
            .eq("user_id", user.id);

        if (error) {
            console.error("Error fetching orgs:", error);
            return [];
        }

        // Map result flatten structure
        return data.map((item: any) => ({
            ...(item.organization as unknown as Organization),
            role: item.role as "owner" | "member" | "admin",
        }));
    },

    /**
     * Create a new organization and make the current user the owner
     */
    async createOrganization(input: CreateOrganizationInput): Promise<{ success: boolean; org?: Organization; error?: string }> {
        const supabase = await createServerClient() as any;
        const user = await getUser();

        if (!user) return { success: false, error: "Not authenticated" };

        // 1. Create Org
        const { data: org, error: createError } = await supabase
            .from("organizations")
            .insert({
                name: input.name,
                slug: input.slug,
                created_by: user.id
            })
            .select()
            .single();

        if (createError) {
            if (createError.code === "23505") { // Unique violation
                return { success: false, error: "Slug already taken" };
            }
            return { success: false, error: createError.message };
        }

        // 2. Add User as Owner
        const { error: memberError } = await supabase
            .from("organization_members")
            .insert({
                organization_id: org.id,
                user_id: user.id,
                role: "owner"
            });

        if (memberError) {
            // Rollback? ideally yes. For now, just error.
            return { success: false, error: "Failed to add owner member" };
        }

        return { success: true, org };
    },

    /**
     * Get organization details if user is a member
     */
    async getOrganization(orgId: string): Promise<Organization | null> {
        const supabase = await createServerClient() as any;

        // RLS policy ensures we only see if we are member
        const { data, error } = await supabase
            .from("organizations")
            .select("*")
            .eq("id", orgId)
            .single();

        if (error) return null;
        return data;
    }
};
