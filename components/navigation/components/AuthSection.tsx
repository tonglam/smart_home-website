"use client";

import { ClerkUserAdapter } from "@/components/ClerkUserAdapter";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { IoLogInOutline } from "react-icons/io5";

interface AuthSectionProps {
  isSignedIn: boolean;
}

export function AuthSection({ isSignedIn }: AuthSectionProps) {
  const { openSignIn } = useClerk();

  return isSignedIn ? (
    <ClerkUserAdapter />
  ) : (
    <Button variant="default" size="sm" onClick={() => openSignIn()}>
      <IoLogInOutline className="mr-2 h-5 w-5" />
      <span className="hidden sm:inline">Sign In</span>
    </Button>
  );
}
