"use client";

import Image from "next/image";
import Link from "next/link";

export function NavbarLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="hidden sm:block">
        <Image
          src="/logo.svg"
          alt="Smart Home Logo"
          width={32}
          height={32}
          className="h-8 w-8"
        />
      </div>
      <div className="sm:hidden">
        <Image
          src="/logo.svg"
          alt="Smart Home Logo"
          width={24}
          height={24}
          className="h-6 w-6"
        />
      </div>
      <span className="text-lg font-semibold">Smart Home</span>
    </Link>
  );
}
