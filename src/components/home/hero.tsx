import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-16 text-center md:py-24">
      <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:mb-6 md:text-6xl">
        Build Forms Together
        <br />
        <span className="text-primary">In Real-Time</span>
      </h1>
      <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground md:mb-8 md:text-xl">
        Collaborative form builder for teams. Edit simultaneously with live
        cursors, instant sync, and seamless collaboration.
      </p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <Button size="lg" asChild className="w-full sm:w-auto">
          <Link href="/signup">Start Building Free</Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/demo">View Demo</Link>
        </Button>
      </div>
    </section>
  );
}
