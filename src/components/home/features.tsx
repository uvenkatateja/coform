import { Card } from "@/components/ui/card";

const FEATURES = [
  {
    title: "Real-time Collaboration",
    description:
      "Multiple users editing simultaneously with live cursors and instant sync.",
  },
  {
    title: "Drag & Drop Builder",
    description:
      "Intuitive interface with 10+ field types. Build forms in minutes.",
  },
  {
    title: "JSON Export",
    description: "Export forms as production-ready JSON. Integrate anywhere.",
  },
] as const;

export function Features() {
  return (
    <section className="border-t bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-2xl font-bold md:mb-12 md:text-3xl">
          Everything You Need
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
