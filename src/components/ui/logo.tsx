import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-lg bg-primary" />
      <span className="text-xl font-bold">CoForm</span>
    </Link>
  );
}
