"use client";

import { Footer } from "@/components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavbarWrapper } from "./components/NavbarWrapper";
import { SupportCard } from "./components/SupportCard";

export function SupportContent() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <NavbarWrapper />

        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-4xl">
            <SupportCard />
          </div>
        </main>

        <Footer />
      </div>
    </TooltipProvider>
  );
}
