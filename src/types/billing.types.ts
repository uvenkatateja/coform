/**
 * Billing Types for DodoPayments Integration
 */

export type SubscriptionStatus =
    | "active"
    | "cancelled"
    | "paused"
    | "past_due"
    | "pending";

export type PlanTier = "free" | "pro" | "enterprise";

export interface Plan {
    id: string;
    name: string;
    tier: PlanTier;
    price: number; // in cents
    interval: "month" | "year";
    features: string[];
    limits: PlanLimits;
    dodoProductId: string; // DodoPayments Product ID
}

export interface PlanLimits {
    formsPerMonth: number;
    submissionsPerMonth: number;
    fileStorageMB: number;
    teamMembers: number;
}

export interface Subscription {
    id: string;
    organizationId: string;
    dodoSubscriptionId: string;
    dodoCustomerId: string;
    planTier: PlanTier;
    status: SubscriptionStatus;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCheckoutInput {
    organizationId: string;
    planTier: PlanTier;
    successUrl: string;
    cancelUrl: string;
}

export interface CheckoutSessionResult {
    checkoutUrl: string;
    sessionId: string;
}
