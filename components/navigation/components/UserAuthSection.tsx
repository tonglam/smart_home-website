"use client";

import { ClerkUserAdapter } from "@/components/auth/ClerkUserAdapter";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { IoLogInOutline } from "react-icons/io5";

interface UserAuthSectionProps {
  isSignedIn: boolean;
}

export function UserAuthSection({ isSignedIn }: UserAuthSectionProps) {
  const { openSignIn } = useClerk();

  return isSignedIn ? (
    <ClerkUserAdapter />
  ) : (
    <Button
      variant="default"
      size="sm"
      onClick={() => openSignIn()}
      aria-label="Sign in to your account"
    >
      <IoLogInOutline className="mr-2 h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">Sign In</span>
    </Button>
  );
}
