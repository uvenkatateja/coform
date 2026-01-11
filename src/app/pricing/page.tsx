import { PricingCard } from "@/components/billing/pricing-card";
import { PLANS, formatPrice } from "@/lib/billing/plans";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

// Prevent static pre-rendering - page needs runtime environment
export const dynamic = "force-dynamic";

export default function PricingPage() {
    const plans = Object.values(PLANS);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
            {/* Header */}
            <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Link>
                        </Button>
                    </div>
                    <span className="text-xl font-bold">CoForm</span>
                    <div></div>
                </div>
            </header>

            {/* Hero */}
            <section className="py-16 md:py-24 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Start free and scale as you grow. No hidden fees, no surprises.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-24">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg ${plan.tier === "pro" ? "border-primary ring-2 ring-primary/20" : ""
                                    }`}
                            >
                                {plan.tier === "pro" && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                                        {plan.price > 0 && (
                                            <span className="text-muted-foreground">/{plan.interval}</span>
                                        )}
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <PricingCard plan={plan} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 border-t bg-muted/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                        <div className="space-y-2">
                            <h3 className="font-medium">Can I cancel anytime?</h3>
                            <p className="text-sm text-muted-foreground">
                                Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-medium">What payment methods do you accept?</h3>
                            <p className="text-sm text-muted-foreground">
                                We accept all major credit cards, debit cards, and various local payment methods through our payment provider.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-medium">Can I upgrade or downgrade?</h3>
                            <p className="text-sm text-muted-foreground">
                                Absolutely! You can change your plan at any time. Upgrades are effective immediately, and downgrades take effect at the next billing cycle.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-medium">Do you offer refunds?</h3>
                            <p className="text-sm text-muted-foreground">
                                We offer a 14-day money-back guarantee. If you're not satisfied, contact us for a full refund.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
