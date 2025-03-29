"use client";

import { AuthActions, AuthState, UserMetadata } from "@/types/hook.types";
import { useClerk, useUser } from "@clerk/nextjs";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

export function useAuth(): AuthState & AuthActions {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, openSignIn, session } = useClerk();

  // Memoize metadata to prevent unnecessary re-renders
  const metadata = useMemo<UserMetadata>(
    () => (user?.publicMetadata as UserMetadata) ?? {},
    [user?.publicMetadata]
  );

  // Memoize derived states
  const homeId = useMemo(() => metadata.homeId, [metadata]);
  const isHomeConnected = useMemo(
    () => isLoaded && !!metadata.homeId,
    [isLoaded, metadata.homeId]
  );

  // Auth actions
  const signIn = useCallback(() => {
    try {
      openSignIn();
    } catch (error) {
      toast.error("Failed to open sign in dialog");
    }
  }, [openSignIn]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  }, [signOut]);

  const refreshSession = useCallback(async () => {
    try {
      await session?.reload();
      toast.success("Session refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh session", {
        description: "Please try signing in again.",
      });
    }
  }, [session]);

  return {
    // Auth states
    isLoaded,
    isSignedIn,
    user,
    metadata,
    homeId,
    isHomeConnected,

    // Auth actions
    signIn,
    signOut: handleSignOut,
    refreshSession,
  } as const;
}
