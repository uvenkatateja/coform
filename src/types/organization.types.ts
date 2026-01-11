import type { Database } from "@/types/database.types";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type OrganizationMember = Database["public"]["Tables"]["organization_members"]["Row"];

export interface OrganizationWithRole extends Organization {
    role: "owner" | "member" | "admin";
}

export interface CreateOrganizationInput {
    name: string;
    slug: string; // unique identifier
}

export interface InviteMemberInput {
    email: string; // In a real app we'd invite by email
    role: "member" | "admin";
}
