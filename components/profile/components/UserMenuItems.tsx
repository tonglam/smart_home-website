"use client";

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { HiOutlineMail } from "react-icons/hi";
import { IoLogOutOutline } from "react-icons/io5";

export interface UserMenuItemsProps {
  /** Callback function when the user wants to change their email */
  onChangeEmail: () => void;
  /** Callback function when the user wants to sign out */
  onSignOut: () => void;
  /** Whether the sign out action is in progress */
  isSigningOut?: boolean;
}

export function UserMenuItems({
  onChangeEmail,
  onSignOut,
  isSigningOut = false,
}: UserMenuItemsProps) {
  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem onClick={onChangeEmail}>
          <HiOutlineMail className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Change Email</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onSignOut}
          disabled={isSigningOut}
          className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
        >
          <IoLogOutOutline className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  );
}
