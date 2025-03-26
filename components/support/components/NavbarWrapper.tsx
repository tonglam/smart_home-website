"use client";

import { Navbar } from "@/components/navigation";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useState } from "react";

export function NavbarWrapper() {
  const { isSignedIn = false } = useAuth();
  const [isHomeConnected, setIsHomeConnected] = useState(false);
  const [isConnectingHome, setIsConnectingHome] = useState(false);

  const handleConnectHome = useCallback(async () => {
    if (isConnectingHome) return;

    try {
      setIsConnectingHome(true);
      // TODO: Implement home connection logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsHomeConnected(true);
    } catch (error) {
      console.error("Failed to connect home:", error);
    } finally {
      setIsConnectingHome(false);
    }
  }, [isConnectingHome]);

  return (
    <Navbar
      isSignedIn={isSignedIn}
      isHomeConnected={isHomeConnected}
      onOpenConnectHome={handleConnectHome}
    />
  );
}
