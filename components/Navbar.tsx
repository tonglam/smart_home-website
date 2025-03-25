"use client";

import { ClerkUserAdapter } from "@/components/ClerkUserAdapter";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoHomeOutline, IoLogInOutline } from "react-icons/io5";

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
                  <IoHomeOutline className="h-5 w-5" />
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
                  <FaGithub className="h-5 w-5" />
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
                    <IoMdHelpCircleOutline className="h-5 w-5" />
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
                <IoLogInOutline className="mr-2 h-5 w-5" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
