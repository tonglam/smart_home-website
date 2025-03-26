import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function NavbarLogo() {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href="/"
      className="flex items-center gap-2"
      aria-label="Smart Home - Go to homepage"
    >
      {!imageError ? (
        <div className="relative">
          <picture>
            <source
              media="(min-width: 640px)"
              srcSet="/logo.svg"
              width="32"
              height="32"
            />
            <Image
              src="/logo.svg"
              alt="Smart Home Logo"
              width={24}
              height={24}
              className="h-6 w-6 sm:h-8 sm:w-8"
              priority
              onError={() => setImageError(true)}
            />
          </picture>
        </div>
      ) : (
        <div
          className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-primary text-primary-foreground"
          aria-hidden="true"
        >
          <span className="text-sm sm:text-base font-semibold">SH</span>
        </div>
      )}
      <span className="text-lg font-semibold select-none">Smart Home</span>
    </Link>
  );
}
