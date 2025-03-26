"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { UserAvatar, UserInfo, UserMenuItems } from "./components";
import { EmailChangeDialog } from "./dialogs/email-change/EmailChangeDialog";

interface UserCardProps {
  /** The user's display name */
  name: string;
  /** The user's email address */
  email: string;
  /** Optional URL for the user's avatar image */
  imageUrl?: string;
  /** Whether the component is in a loading state */
  isLoading?: boolean;
  /** Callback function when the user signs out */
  onSignOut: () => void;
  /** Callback function when the user changes their email */
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

      <EmailChangeDialog
        open={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
        onEmailChange={onEmailChange}
        currentEmail={email}
      />
    </>
  );
}
