"use client";

import {
  AuthSection,
  ConnectHomeButton,
  GitHubButton,
  NavbarLogo,
  SupportButton,
} from "./components";

// Props interface
interface NavbarProps {
  isSignedIn: boolean;
  isHomeConnected: boolean;
  onOpenConnectHome: () => void;
}

// Main Navbar component
export function Navbar({
  isSignedIn,
  isHomeConnected,
  onOpenConnectHome,
}: NavbarProps) {
  return (
    <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <NavbarLogo />
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ConnectHomeButton
              isSignedIn={isSignedIn}
              isHomeConnected={isHomeConnected}
              onClick={onOpenConnectHome}
            />
            <GitHubButton />
            <SupportButton />
            <AuthSection isSignedIn={isSignedIn} />
          </div>
        </div>
      </div>
    </nav>
  );
}
