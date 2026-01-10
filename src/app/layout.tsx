import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "CoForm - Real-time Collaborative Form Builder",
    template: "%s | CoForm",
  },
  description:
    "Build forms together with your team in real-time. Like Figma for forms.",
  keywords: [
    "form builder",
    "collaborative",
    "real-time",
    "forms",
    "team collaboration",
    "coform",
  ],
  authors: [{ name: "CoForm Team" }],
  creator: "CoForm",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://coform.app",
    title: "CoForm - Real-time Collaborative Form Builder",
    description: "Build forms together with your team in real-time.",
    siteName: "CoForm",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoForm - Real-time Collaborative Form Builder",
    description: "Build forms together with your team in real-time.",
    creator: "@coformapp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
