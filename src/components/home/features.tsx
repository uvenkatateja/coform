import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  MousePointer2,
  FileJson,
  Bot,
  ShieldCheck,
  BarChart3
} from "lucide-react";

const FEATURES = [
  {
    title: "Real-time Collaboration",
    description:
      "Edit forms simultaneously with your team. See live cursors and changes instantly.",
    icon: Users,
  },
  {
    title: "AI Generation",
    description:
      "Describe your form in plain English and let our AI build it for you in seconds.",
    icon: Bot,
  },
  {
    title: "Smart Logic",
    description:
      "Create dynamic forms with conditional logic, branching, and calculations.",
    icon: MousePointer2,
  },
  {
    title: "Enterprise Security",
    description:
      "Built-in spam protection with Cloudflare Turnstile and secure data encryption.",
    icon: ShieldCheck,
  },
  {
    title: "Advanced Analytics",
    description:
      "Track submissions, drop-off rates, and performance metrics in real-time.",
    icon: BarChart3,
  },
  {
    title: "Developer First",
    description: "Export forms as JSON schema. Webhooks and API access included.",
    icon: FileJson,
  },
] as const;

export function Features() {
  return (
    <section className="bg-muted/30 py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Everything You Need to build
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed for modern teams.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="group relative overflow-hidden border-muted/50 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
