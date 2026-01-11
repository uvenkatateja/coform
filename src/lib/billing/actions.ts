"use server";

import { billingService } from "./service";
import { getUser } from "@/lib/auth/actions";
import { organizationService } from "@/lib/organizations/service";
import type { PlanTier } from "@/types/billing.types";

/**
 * Create checkout session for upgrading to a paid plan
 */
export async function createCheckoutAction(
    organizationId: string,
    planTier: PlanTier
): Promise<{ success: boolean; checkoutUrl?: string; error?: string }> {
    const user = await getUser();
    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    // Verify user has access to this organization
    const org = await organizationService.getOrganization(organizationId);
    if (!org) {
        return { success: false, error: "Organization not found" };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${appUrl}/dashboard?orgId=${organizationId}&upgraded=true`;

    try {
        const result = await billingService.createCheckoutSession(
            organizationId,
            planTier,
            user.email || "",
            successUrl
        );

        return { success: true, checkoutUrl: result.checkoutUrl };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create checkout";
        return { success: false, error: message };
    }
}

/**
 * Get subscription for current organization
 */
export async function getSubscriptionAction(organizationId: string) {
    const user = await getUser();
    if (!user) return null;

    return billingService.getSubscription(organizationId);
}

/**
 * Cancel subscription
 */
export async function cancelSubscriptionAction(
    subscriptionId: string
): Promise<{ success: boolean; error?: string }> {
    const user = await getUser();
    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    try {
        await billingService.cancelSubscription(subscriptionId);
        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to cancel";
        return { success: false, error: message };
    }
}

/**
 * Get customer portal URL
 */
export async function getCustomerPortalUrlAction(
    customerId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
    const user = await getUser();
    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    try {
        const url = await billingService.getCustomerPortalUrl(customerId);
        return { success: true, url };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to get portal";
        return { success: false, error: message };
    }
}
