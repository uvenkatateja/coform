import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { Testimonials } from "@/components/home/testimonials";
import { CTA } from "@/components/home/cta";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CoForm - The AI-Powered Collaborative Form Builder",
  description: "Build beautiful forms in minutes with AI. Collaborate with your team in real-time. Export to JSON, webhooks, and more.",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
