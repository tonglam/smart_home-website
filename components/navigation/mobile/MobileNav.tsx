"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { MainNavLinks } from "../main/MainNavLinks";
import { UserNav } from "../profile/UserNav";

export function MobileNav() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
      <SheetContent
        side="right"
        className="w-[280px] sm:w-[350px]"
        onInteractOutside={(e) => {
          // Prevent closing the sheet when clicking on dialogs
          if (
            e.target instanceof Node &&
            document.querySelector('[role="dialog"]')?.contains(e.target)
          ) {
            e.preventDefault();
          }
        }}
      >
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <MainNavLinks />
          </div>
          <div className="flex flex-col gap-4">
            <UserNav />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
