"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HiMenuAlt4 } from "react-icons/hi";
import { ConnectHomeButton } from "./ConnectHomeButton";
import { GitHubRepositoryLink } from "./GitHubRepositoryLink";
import { SupportLink } from "./SupportLink";
import { UserAuthSection } from "./UserAuthSection";

interface MobileMenuProps {
  isSignedIn: boolean;
  isHomeConnected: boolean;
  onOpenConnectHome: () => void;
}

export function MobileMenu({
  isSignedIn,
  isHomeConnected,
  onOpenConnectHome,
}: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <HiMenuAlt4 className="h-5 w-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <ConnectHomeButton
              isSignedIn={isSignedIn}
              isHomeConnected={isHomeConnected}
              onClick={onOpenConnectHome}
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <GitHubRepositoryLink />
              <SupportLink />
            </div>
            <UserAuthSection isSignedIn={isSignedIn} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
