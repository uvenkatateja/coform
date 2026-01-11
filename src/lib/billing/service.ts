import { dodoClient } from "./dodo";
import { getPlan } from "./plans";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { PlanTier, Subscription, CheckoutSessionResult } from "@/types/billing.types";

/**
 * Billing Service
 * Handles subscription management via DodoPayments
 */
export const billingService = {
    /**
     * Create a checkout session for subscription
     */
    async createCheckoutSession(
        organizationId: string,
        planTier: PlanTier,
        customerEmail: string,
        successUrl: string
    ): Promise<CheckoutSessionResult> {
        const plan = getPlan(planTier);

        if (!plan.dodoProductId) {
            throw new Error("Cannot checkout free plan");
        }

        // Use checkout sessions for hosted checkout experience
        const response = await dodoClient.checkoutSessions.create({
            product_cart: [
                {
                    product_id: plan.dodoProductId,
                    quantity: 1,
                },
            ],
            success_url: successUrl,
            customer: {
                email: customerEmail,
            },
            metadata: {
                organization_id: organizationId,
                plan_tier: planTier,
            },
        } as any); // Type cast to bypass strict SDK type checking

        return {
            checkoutUrl: response.checkout_url || "",
            sessionId: response.session_id,
        };
    },

    /**
     * Get subscription for an organization
     */
    async getSubscription(organizationId: string): Promise<Subscription | null> {
        const supabase = createServiceRoleClient() as any;

        const { data, error } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("organization_id", organizationId)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            organizationId: data.organization_id,
            dodoSubscriptionId: data.dodo_subscription_id,
            dodoCustomerId: data.dodo_customer_id,
            planTier: data.plan_tier as PlanTier,
            status: data.status as Subscription["status"],
            currentPeriodStart: data.current_period_start || "",
            currentPeriodEnd: data.current_period_end || "",
            cancelAtPeriodEnd: data.cancel_at_period_end,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        };
    },

    /**
     * Cancel subscription at period end
     */
    async cancelSubscription(subscriptionId: string): Promise<void> {
        await dodoClient.subscriptions.update(subscriptionId, {
            status: "cancelled",
        } as any);
    },

    /**
     * Get customer portal URL for managing subscription
     */
    async getCustomerPortalUrl(customerId: string): Promise<string> {
        const session = await dodoClient.customers.customerPortal.create(
            customerId,
            {} as any
        );
        return session.link;
    },

    /**
     * Sync subscription from DodoPayments webhook
     */
    async syncSubscription(
        dodoSubscriptionId: string,
        dodoCustomerId: string,
        organizationId: string,
        planTier: PlanTier,
        status: Subscription["status"],
        periodStart?: string,
        periodEnd?: string
    ): Promise<void> {
        const supabase = createServiceRoleClient() as any;

        const { error } = await supabase
            .from("subscriptions")
            .upsert(
                {
                    dodo_subscription_id: dodoSubscriptionId,
                    dodo_customer_id: dodoCustomerId,
                    organization_id: organizationId,
                    plan_tier: planTier,
                    status: status,
                    current_period_start: periodStart || null,
                    current_period_end: periodEnd || null,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: "dodo_subscription_id",
                }
            );

        if (error) {
            console.error("Failed to sync subscription:", error);
            throw error;
        }
    },
};
