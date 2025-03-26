"use client";

import { UserCard } from "@/components/profile";
import { useUser } from "@clerk/nextjs";

// Props interface
interface ClerkUserAdapterProps {
  onSignOut: () => void;
}

// Main component
export function ClerkUserAdapter({ onSignOut }: ClerkUserAdapterProps) {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user) {
    return null;
  }

  // Format name from user data
  const userName =
    user.fullName ||
    (user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : "User");

  // Get email from user data
  const userEmail = user.primaryEmailAddress?.emailAddress || "";

  return (
    <UserCard
      name={userName}
      email={userEmail}
      imageUrl={user.imageUrl}
      onSignOut={onSignOut}
    />
  );
}
