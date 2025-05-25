/**
 * Custom hook for managing authentication-related navigation and home connection dialog
 * Provides state and handlers for showing/hiding the home connection interface
 *
 * @returns {AuthNavigationState} Object containing:
 * - Authentication state (isLoaded, isSignedIn)
 * - Home connection state (isHomeConnected, homeId)
 * - Dialog control state and handlers (showConnectHome, openConnectHome, closeConnectHome)
 */
"use client";

import { AuthNavigationState } from "@/types/hook.types";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export function useAuthNavigation(): AuthNavigationState {
  const { isLoaded, isSignedIn, isHomeConnected, homeId } = useAuth();
  const [showConnectHome, setShowConnectHome] = useState(false);

  /**
   * Opens the home connection dialog if user is authenticated
   * Shows error toast if user is not signed in
   */
  const openConnectHome = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to connect your home");
      return;
    }
    setShowConnectHome(true);
  };

  /**
   * Closes the home connection dialog
   */
  const closeConnectHome = () => {
    setShowConnectHome(false);
  };

  return {
    isLoaded,
    isSignedIn,
    isHomeConnected,
    homeId,
    showConnectHome,
    openConnectHome,
    closeConnectHome,
  } as const;
}
