import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">Docs</Link>
            <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
          </nav>
        </div>
        <nav className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
