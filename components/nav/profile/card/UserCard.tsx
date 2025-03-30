"use client";

import { EmailDialog } from "@/components/nav/profile/email/EmailDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { UserAvatar } from "./UserAvatar";
import { UserInfo } from "./UserInfo";
import { UserMenuItems } from "./UserMenuItems";

interface UserCardProps {
  name: string;
  email: string;
  imageUrl?: string;
  isLoading?: boolean;
  onSignOut: () => Promise<void>;
  onEmailChange: (email: string) => Promise<void>;
}

export function UserCard({
  name,
  email,
  imageUrl,
  isLoading = false,
  onSignOut,
  onEmailChange,
}: UserCardProps) {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await onSignOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  if (isLoading) {
    return (
      <Button
        variant="ghost"
        className="relative h-8 w-8 rounded-full"
        disabled
      >
        <div className="animate-pulse bg-muted rounded-full h-full w-full" />
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full"
            aria-label="Open user menu"
          >
            <UserAvatar name={name} imageUrl={imageUrl} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          align="end"
          forceMount
          aria-label="User menu"
        >
          <DropdownMenuLabel className="font-normal">
            <UserInfo name={name} email={email} />
          </DropdownMenuLabel>
          <UserMenuItems
            onChangeEmail={() => setIsEmailDialogOpen(true)}
            onSignOut={handleSignOut}
            isSigningOut={isSigningOut}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <EmailDialog
        open={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
        onEmailChange={onEmailChange}
        currentEmail={email}
      />
    </>
  );
}
