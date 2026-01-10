import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold md:mb-6 md:text-4xl">
          Ready to Build Together?
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-base text-muted-foreground md:mb-8 md:text-lg">
          Join teams building better forms with real-time collaboration.
        </p>
        <Button size="lg" asChild className="w-full sm:w-auto">
          <Link href="/signup">Get Started Free</Link>
        </Button>
      </div>
    </section>
  );
}
