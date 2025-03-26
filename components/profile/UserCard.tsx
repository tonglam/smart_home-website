"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { FaEnvelope, FaSignOutAlt, FaUser } from "react-icons/fa";
import { EmailChangeDialog } from "./EmailChangeDialog";

// Props interface
interface UserCardProps {
  name: string;
  email: string;
  imageUrl?: string;
  onSignOut: () => void;
}

// User Avatar component
const UserAvatar = ({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl?: string;
}) => (
  <Avatar className="h-8 w-8">
    <AvatarImage src={imageUrl} alt={name} />
    <AvatarFallback>
      <FaUser className="h-4 w-4" />
    </AvatarFallback>
  </Avatar>
);

// User info display in dropdown
const UserInfo = ({ name, email }: { name: string; email: string }) => (
  <div className="flex flex-col space-y-1">
    <p className="text-sm font-medium leading-none">{name}</p>
    <p className="text-xs leading-none text-muted-foreground">{email}</p>
  </div>
);

// Dropdown menu items
const UserMenuItems = ({
  onSignOut,
  onChangeEmail,
}: {
  onSignOut: () => void;
  onChangeEmail: () => void;
}) => (
  <>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={onChangeEmail}>
      <FaEnvelope className="mr-2 h-4 w-4" />
      <span>Change Email</span>
    </DropdownMenuItem>
    <DropdownMenuItem onClick={onSignOut}>
      <FaSignOutAlt className="mr-2 h-4 w-4" />
      <span>Sign out</span>
    </DropdownMenuItem>
  </>
);

// Main UserCard component
export function UserCard({ name, email, imageUrl, onSignOut }: UserCardProps) {
  const [showEmailChangeDialog, setShowEmailChangeDialog] = useState(false);
  const [userEmail, setUserEmail] = useState(email);

  const handleEmailChange = (newEmail: string) => {
    setUserEmail(newEmail);
  };

  return (
    <>
      <EmailChangeDialog
        open={showEmailChangeDialog}
        onOpenChange={setShowEmailChangeDialog}
        currentEmail={userEmail}
        onEmailChange={handleEmailChange}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <UserAvatar name={name} imageUrl={imageUrl} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <UserInfo name={name} email={userEmail} />
          </DropdownMenuLabel>
          <UserMenuItems
            onSignOut={onSignOut}
            onChangeEmail={() => setShowEmailChangeDialog(true)}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
