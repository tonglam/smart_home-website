import Image from "next/image";
import Link from "next/link";

export function MainNavLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2"
      aria-label="Smart Home - Go to homepage"
    >
      <div className="relative">
        <Image
          src="/logo.svg"
          alt="Smart Home Logo"
          width={24}
          height={24}
          className="h-6 w-6 sm:h-8 sm:w-8"
          priority
        />
      </div>
      <span className="text-lg font-semibold select-none">Smart Home</span>
    </Link>
  );
}
