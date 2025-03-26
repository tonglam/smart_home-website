"use client";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FaEnvelope, FaSignOutAlt } from "react-icons/fa";

interface UserMenuItemsProps {
  onChangeEmail: () => void;
  onSignOut: () => void;
}

export function UserMenuItems({
  onChangeEmail,
  onSignOut,
}: UserMenuItemsProps) {
  return (
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
}
