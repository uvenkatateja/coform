import type { Plan, PlanTier } from "@/types/billing.types";

/**
 * Plan Definitions
 * Product IDs should match DodoPayments dashboard
 */
export const PLANS: Record<PlanTier, Plan> = {
    free: {
        id: "free",
        name: "Free",
        tier: "free",
        price: 0,
        interval: "month",
        dodoProductId: "", // No product needed for free tier
        features: [
            "3 forms",
            "100 submissions/month",
            "Basic spam protection",
            "Email notifications",
        ],
        limits: {
            formsPerMonth: 3,
            submissionsPerMonth: 100,
            fileStorageMB: 100,
            teamMembers: 1,
        },
    },
    pro: {
        id: "pro",
        name: "Pro",
        tier: "pro",
        price: 1900, // $19.00
        interval: "month",
        dodoProductId: process.env.DODO_PRO_PRODUCT_ID || "prod_pro_monthly",
        features: [
            "Unlimited forms",
            "10,000 submissions/month",
            "Advanced spam protection",
            "Priority email support",
            "Custom branding",
            "Webhooks",
            "API access",
        ],
        limits: {
            formsPerMonth: -1, // unlimited
            submissionsPerMonth: 10000,
            fileStorageMB: 1000,
            teamMembers: 5,
        },
    },
    enterprise: {
        id: "enterprise",
        name: "Enterprise",
        tier: "enterprise",
        price: 7900, // $79.00
        interval: "month",
        dodoProductId: process.env.DODO_ENTERPRISE_PRODUCT_ID || "prod_enterprise_monthly",
        features: [
            "Everything in Pro",
            "Unlimited submissions",
            "Unlimited team members",
            "SSO / SAML",
            "Dedicated support",
            "Custom integrations",
            "SLA guarantee",
        ],
        limits: {
            formsPerMonth: -1,
            submissionsPerMonth: -1,
            fileStorageMB: 10000,
            teamMembers: -1,
        },
    },
};

export function getPlan(tier: PlanTier): Plan {
    return PLANS[tier];
}

export function formatPrice(cents: number): string {
    if (cents === 0) return "Free";
    return `$${(cents / 100).toFixed(2)}`;
}
