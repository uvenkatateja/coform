import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32">
      {/* Background Gradients */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[500px] bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-50 blur-3xl" />

      <div className="container relative mx-auto px-4 text-center">
        {/* Badge */}
        <div className="mx-auto mb-8 inline-flex items-center rounded-full border bg-background/50 px-3 py-1 text-sm font-medium backdrop-blur-sm">
          <span className="mr-2 flex h-2 w-2 items-center justify-center rounded-full bg-primary relative">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
          </span>
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            v2.0 is now live
          </span>
        </div>

        {/* Heading */}
        <h1 className="mx-auto mb-6 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
          Build Forms that
          <span className="block bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent pb-2">
            Feel Alive
          </span>
        </h1>

        {/* Subheading */}
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          The first AI-powered form builder with real-time collaboration.
          Design, publish, and analyze forms in minutes, not hours.
        </p>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button size="lg" className="h-12 min-w-[180px] text-base" asChild>
            <Link href="/signup">
              Start Building Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 min-w-[180px] text-base" asChild>
            <Link href="/demo">
              <Zap className="mr-2 h-4 w-4" />
              Live Demo
            </Link>
          </Button>
        </div>

        {/* Social Proof / Stats */}
        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground md:gap-12">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>AI Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-slate-200" />
              ))}
            </div>
            <span>Real-time Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">10k+</span>
            <span>Submissions</span>
          </div>
        </div>

        {/* Product Preview Placeholder */}
        <div className="mt-16 md:mt-24 perspective-[2000px]">
          <div className="relative mx-auto max-w-5xl rounded-xl border bg-background/50 p-2 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:rotate-x-2 md:rotate-x-6 transform-gpu">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 border-b pb-4 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <div className="ml-4 h-6 w-64 rounded-md bg-muted/50" />
              </div>
              <div className="space-y-4">
                <div className="h-8 w-1/3 rounded bg-muted/30" />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="h-32 rounded-lg border-2 border-dashed border-muted bg-muted/10" />
                  <div className="h-32 rounded-lg border bg-card p-4">
                    <div className="mb-2 h-4 w-20 rounded bg-muted/30" />
                    <div className="h-8 rounded bg-muted/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow effect behind interface */}
          <div className="absolute inset-0 -z-10 bg-primary/20 blur-[100px] h-full w-full rounded-full opacity-50" />
        </div>
      </div>
    </section>
  );
}
