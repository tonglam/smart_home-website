"use client";

import { ClerkUserAdapter } from "@/components/ClerkUserAdapter";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Github, HelpCircle, Home, HomeIcon, LogIn } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  isSignedIn: boolean;
  isHomeConnected: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenConnectHome: () => void;
}

export function Navbar({
  isSignedIn,
  isHomeConnected,
  onSignIn,
  onSignOut,
  onOpenConnectHome,
}: NavbarProps) {
  return (
    <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-md hidden sm:flex">
                <HomeIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="p-1.5 bg-primary/10 rounded-full sm:hidden">
                <HomeIcon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-lg font-semibold">Smart Home</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Connect Home Button with Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isSignedIn ? "outline" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={onOpenConnectHome}
                  disabled={!isSignedIn}
                >
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isHomeConnected
                      ? "Connected"
                      : isSignedIn
                      ? "Connect Home"
                      : "Sign in to Connect"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isSignedIn
                    ? "Connect your home to receive alerts and control your devices"
                    : "Sign in first to connect your smart home"}
                </p>
                {isSignedIn && !isHomeConnected && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Your email will be used to receive important alerts
                  </p>
                )}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full transition-colors hover:bg-muted"
                  onClick={() =>
                    window.open(
                      "https://github.com/tonglam/smart_home-website",
                      "_blank"
                    )
                  }
                >
                  <Github className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Source Code</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/support">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full transition-colors hover:bg-muted"
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get Help & Support</p>
              </TooltipContent>
            </Tooltip>

            {isSignedIn ? (
              <ClerkUserAdapter onSignOut={onSignOut} />
            ) : (
              <Button variant="default" size="sm" onClick={onSignIn}>
                <LogIn className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
