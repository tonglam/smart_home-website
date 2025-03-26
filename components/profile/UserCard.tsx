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
  name: string;
  email: string;
  imageUrl?: string;
  onSignOut: () => void;
  onEmailChange: (email: string) => Promise<void>;
}

export function UserCard({
  name,
  email,
  imageUrl,
  onSignOut,
  onEmailChange,
}: UserCardProps) {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <UserAvatar name={name} imageUrl={imageUrl} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <UserInfo name={name} email={email} />
          </DropdownMenuLabel>
          <UserMenuItems
            onChangeEmail={() => setIsEmailDialogOpen(true)}
            onSignOut={onSignOut}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <EmailChangeDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        onSubmit={onEmailChange}
      />
    </>
  );
}
