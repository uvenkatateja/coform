"use server";

import { revalidatePath } from "next/cache";
import { organizationService } from "./service";
import type { CreateOrganizationInput } from "@/types/organization.types";

export async function createOrganizationAction(input: CreateOrganizationInput) {
    const result = await organizationService.createOrganization(input);
    if (result.success) {
        revalidatePath("/dashboard");
        return { success: true, orgId: result.org?.id };
    }
    return { success: false, error: result.error };
}

export async function getUserOrganizationsAction() {
    return await organizationService.listUserOrganizations();
}

/**
 * Switch context implies just navigating to a view filtered by that ID.
 * State is URL based.
 */
