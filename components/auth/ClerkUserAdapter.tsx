"use client";

import { UserCard } from "@/components/profile/UserCard";
import { useClerk, useUser } from "@clerk/nextjs";

export function ClerkUserAdapter() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

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

  const handleSignOut = async () => {
    await signOut();
  };

  const handleEmailChange = async (newEmail: string) => {
    console.warn("Email change not implemented:", newEmail);
  };

  return (
    <UserCard
      name={userName}
      email={userEmail}
      imageUrl={user.imageUrl}
      onSignOut={handleSignOut}
      onEmailChange={handleEmailChange}
    />
  );
}
