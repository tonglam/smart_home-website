/**
 * Core authentication hook that manages user state and auth actions
 * Provides user data, auth status, and authentication methods
 */
"use client";

import { AuthActions, AuthState, UserMetadata } from "@/types/hook.types";
import { useClerk, useUser } from "@clerk/nextjs";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

/**
 * Hook for managing authentication state and actions
 * Combines Clerk's auth utilities with custom functionality
 */
export function useAuth(): AuthState & AuthActions {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, openSignIn, session } = useClerk();

  // Extract and memoize user metadata
  const metadata = useMemo<UserMetadata>(
    () => (user?.publicMetadata as UserMetadata) ?? {},
    [user?.publicMetadata]
  );

  // Derive home connection status
  const homeId = useMemo(() => metadata.homeId, [metadata]);
  const isHomeConnected = useMemo(
    () => isLoaded && !!metadata.homeId,
    [isLoaded, metadata.homeId]
  );

  // Auth action handlers with error handling
  const signIn = useCallback(() => {
    try {
      openSignIn();
    } catch {
      toast.error("Failed to open sign in dialog");
    }
  }, [openSignIn]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch {
      toast.error("Failed to sign out");
    }
  }, [signOut]);

  const refreshSession = useCallback(async () => {
    try {
      await session?.reload();
      toast.success("Session refreshed successfully");
    } catch {
      toast.error("Failed to refresh session", {
        description: "Please try signing in again.",
      });
    }
  }, [session]);

  return {
    isLoaded,
    isSignedIn,
    user,
    metadata,
    homeId,
    isHomeConnected,
    signIn,
    signOut: handleSignOut,
    refreshSession,
  } as const;
}
