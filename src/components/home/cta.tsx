import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-24 text-center text-primary-foreground shadow-2xl md:px-12 md:py-32">
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.purple.500),theme(colors.primary.DEFAULT))] opacity-20" />

          <h2 className="mx-auto mb-6 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to transform how you build forms?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
            Join thousands of developers building modern, interactive forms in minutes.
            No credit card required for the free tier.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" className="h-12 min-w-[180px] text-base font-semibold" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 min-w-[180px] border-primary-foreground/20 bg-transparent text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
