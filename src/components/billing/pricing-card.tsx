"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createCheckoutAction } from "@/lib/billing/actions";
import type { Plan } from "@/types/billing.types";

interface PricingCardProps {
    plan: Plan;
}

export function PricingCard({ plan }: PricingCardProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const orgId = searchParams.get("orgId");

    function handleUpgrade() {
        if (plan.tier === "free") {
            router.push("/signup");
            return;
        }

        if (!orgId) {
            // Redirect to dashboard to select an organization first
            router.push("/dashboard?selectOrg=true");
            return;
        }

        setError(null);
        startTransition(async () => {
            const result = await createCheckoutAction(orgId, plan.tier);

            if (result.success && result.checkoutUrl) {
                // Redirect to DodoPayments checkout
                window.location.href = result.checkoutUrl;
            } else {
                setError(result.error || "Failed to start checkout");
            }
        });
    }

    function getButtonText(): string {
        if (plan.tier === "free") return "Get Started";
        if (plan.tier === "enterprise") return "Contact Sales";
        return "Upgrade Now";
    }

    function getButtonVariant(): "default" | "outline" {
        if (plan.tier === "pro") return "default";
        return "outline";
    }

    return (
        <div className="space-y-2">
            <Button
                onClick={handleUpgrade}
                disabled={isPending}
                variant={getButtonVariant()}
                className="w-full"
                size="lg"
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                    </>
                ) : (
                    getButtonText()
                )}
            </Button>

            {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
            )}
        </div>
    );
}
