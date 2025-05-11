"use client";

import { AuthNavigationState } from "@/types/hook.types";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export function useAuthNavigation(): AuthNavigationState {
  const { isLoaded, isSignedIn, isHomeConnected, homeId } = useAuth();
  const [showConnectHome, setShowConnectHome] = useState(false);

  const openConnectHome = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to connect your home");
      return;
    }
    setShowConnectHome(true);
  };

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
