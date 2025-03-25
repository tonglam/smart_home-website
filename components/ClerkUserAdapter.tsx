"use client";

import { useUser } from "@clerk/nextjs";
import { UserCard } from "./UserCard";

export function ClerkUserAdapter({ onSignOut }: { onSignOut: () => void }) {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user) {
    return null;
  }

  return (
    <UserCard
      name={user.fullName || user.firstName + " " + user.lastName || "User"}
      email={user.primaryEmailAddress?.emailAddress || ""}
      imageUrl={user.imageUrl}
      onSignOut={onSignOut}
    />
  );
}
