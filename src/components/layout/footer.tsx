import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              The AI-powered form builder for modern teams. Build, collaborate, and scale.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com" target="_blank" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" target="_blank" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/features" className="hover:text-primary">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
              <li><Link href="/templates" className="hover:text-primary">Templates</Link></li>
              <li><Link href="/changelog" className="hover:text-primary">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/docs" className="hover:text-primary">Documentation</Link></li>
              <li><Link href="/api" className="hover:text-primary">API Reference</Link></li>
              <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
              <li><Link href="/community" className="hover:text-primary">Community</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/security" className="hover:text-primary">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CoForm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
