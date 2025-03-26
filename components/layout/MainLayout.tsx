"use client";

import { Footer, Navbar } from "@/components/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  isSignedIn?: boolean;
  isHomeConnected?: boolean;
  onOpenConnectHome?: () => void;
  hideNavbar?: boolean;
}

export function MainLayout({
  children,
  isSignedIn = false,
  isHomeConnected = false,
  onOpenConnectHome = () => {},
  hideNavbar = false,
}: MainLayoutProps) {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {!hideNavbar && (
          <Navbar
            isSignedIn={isSignedIn}
            isHomeConnected={isHomeConnected}
            onOpenConnectHome={onOpenConnectHome}
          />
        )}

        {children}

        <Footer />
      </div>
    </TooltipProvider>
  );
}
