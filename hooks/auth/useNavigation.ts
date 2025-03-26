"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";

export function useNavigation() {
  const { user, isLoaded } = useUser();
  const { signOut, openSignIn } = useClerk();
  const isSignedIn = isLoaded && !!user;
  const isHomeConnected = isLoaded ? !!user?.publicMetadata?.homeId : false;
  const [showConnectHome, setShowConnectHome] = useState(false);

  const handleSignIn = () => openSignIn();
  const handleSignOut = () => signOut();
  const handleOpenConnectHome = () => isSignedIn && setShowConnectHome(true);

  return {
    isSignedIn,
    isHomeConnected,
    showConnectHome,
    setShowConnectHome,
    handleSignIn,
    handleSignOut,
    handleOpenConnectHome,
  };
}
