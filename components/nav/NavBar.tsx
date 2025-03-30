"use client";

import { MainNavLinks } from "@/components/nav/main/MainNavLinks";
import { MainNavLogo } from "@/components/nav/main/MainNavLogo";
import { MobileNav } from "@/components/nav/mobile/MobileNav";
import { UserNav } from "@/components/nav/profile/UserNav";

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        className="container mx-auto"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <MainNavLogo />
          </div>
          {/* Desktop Navigation */}
          <div
            className="hidden lg:flex items-center gap-4"
            role="group"
            aria-label="Navigation actions"
          >
            <MainNavLinks />
            <UserNav />
          </div>
          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
