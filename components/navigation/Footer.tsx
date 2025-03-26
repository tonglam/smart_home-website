import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex items-center justify-between py-4">
        <p className="text-sm text-muted-foreground">
          Built with Next.js and Tailwind CSS
        </p>
        <nav className="flex gap-4">
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:underline"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:underline"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
