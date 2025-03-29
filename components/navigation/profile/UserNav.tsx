"use client";

import { updateUserEmail } from "@/app/actions/user/user.action";
import { UserCard } from "@/components/navigation/profile/card/UserCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useClerk, useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export function UserNav() {
  const { signOut } = useClerk();
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="h-9 flex items-center">
        <Skeleton className="h-8 w-[100px]" />
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <UserCard
      name={user.fullName || "User"}
      email={user.primaryEmailAddress?.emailAddress || ""}
      imageUrl={user.imageUrl}
      onSignOut={async () => {
        try {
          await signOut();
          toast.success("Signed out successfully");
        } catch {
          toast.error("Failed to sign out");
        }
      }}
      onEmailChange={async (email) => {
        try {
          const result = await updateUserEmail(user.id, email);

          if (!result.success) {
            throw new Error(result.error);
          }

          toast.success("Notification email updated successfully", {
            description:
              "You will receive smart home alerts at this email address.",
          });
        } catch (error) {
          toast.error("Failed to update notification email", {
            description:
              error instanceof Error
                ? error.message
                : "Please try again or contact support.",
          });
        }
      }}
    />
  );
}
