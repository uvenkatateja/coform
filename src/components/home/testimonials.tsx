import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
    {
        quote:
            "CoForm has completely transformed how our product team collects feedback. The AI generation feature alone saved us weeks of work.",
        author: "Sarah Chen",
        role: "Product Manager",
        company: "TechFlow",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
        quote:
            "The real-time collaboration is a game changer. It feels like Figma for forms. No more emailing JSON files back and forth.",
        author: "Michael Ross",
        role: "Engineering Lead",
        company: "BuildBetter",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
        quote:
            "Simple, beautiful, and developer-friendly. The webhook integration worked flawlessly with our existing stack.",
        author: "Jessica Wu",
        role: "CTO",
        company: "StartUp Inc",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    },
] as const;

export function Testimonials() {
    return (
        <section className="py-24 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                        Loved by Developers
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Don't just take our word for it. Here's what teams are saying.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    {TESTIMONIALS.map((testimonial) => (
                        <Card key={testimonial.author} className="border-muted/50 bg-muted/20">
                            <CardHeader>
                                <Quote className="h-8 w-8 text-primary/20" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-lg text-muted-foreground">
                                    "{testimonial.quote}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={testimonial.image} />
                                        <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold">{testimonial.author}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {testimonial.role}, {testimonial.company}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
