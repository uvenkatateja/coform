import { NextRequest, NextResponse } from "next/server";
import { billingService } from "@/lib/billing/service";
import type { PlanTier, SubscriptionStatus } from "@/types/billing.types";

/**
 * DodoPayments Webhook Handler
 * Receives subscription events and syncs to database
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const eventType = body.type;

        console.log("Webhook received:", eventType);

        // Handle subscription events
        if (eventType.startsWith("subscription.")) {
            await handleSubscriptionEvent(body);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}

async function handleSubscriptionEvent(event: any): Promise<void> {
    const subscription = event.data;
    const metadata = subscription.metadata || {};

    const organizationId = metadata.organization_id;
    const planTier = (metadata.plan_tier || "pro") as PlanTier;

    if (!organizationId) {
        console.error("Missing organization_id in webhook metadata");
        return;
    }

    // Map DodoPayments status to our status
    const statusMap: Record<string, SubscriptionStatus> = {
        active: "active",
        cancelled: "cancelled",
        paused: "paused",
        past_due: "past_due",
        pending: "pending",
        on_hold: "paused",
    };

    const status = statusMap[subscription.status] || "pending";

    await billingService.syncSubscription(
        subscription.subscription_id,
        subscription.customer_id,
        organizationId,
        planTier,
        status,
        subscription.current_period_start,
        subscription.current_period_end
    );

    console.log(`Subscription synced: ${subscription.subscription_id} -> ${status}`);
}

// Verify webhook signature (optional but recommended)
// DodoPayments provides signature headers for verification
