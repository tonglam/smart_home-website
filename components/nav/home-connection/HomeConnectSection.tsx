"use client";

import { useAuthNavigation } from "@/components/auth/AuthNavigationContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { useHomeConnection } from "@/hooks/home/useHomeConnection";
import { useEffect } from "react";
import { HomeConnectionDialog } from "./dialog/HomeConnectionDialog";
import { HomeConnectionPrompt } from "./prompt/HomeConnectionPrompt";

interface HomeConnectSectionProps {
  onConnectionChange?: (connected: boolean) => void;
  initialHomeId?: string | null;
}

export function HomeConnectSection({
  onConnectionChange,
  initialHomeId,
}: HomeConnectSectionProps = {}) {
  const { isSignedIn, isLoaded } = useAuth();
  const { showConnectHome, openConnectHome, closeConnectHome } =
    useAuthNavigation();

  const { currentHomeId } = useHomeConnection({
    open: showConnectHome,
    onOpenChange: closeConnectHome,
    initialHomeId,
  });

  useEffect(() => {
    onConnectionChange?.(Boolean(currentHomeId));
  }, [currentHomeId, onConnectionChange]);

  const shouldShowPrompt =
    isLoaded && isSignedIn && !currentHomeId && !showConnectHome;

  return (
    <>
      {shouldShowPrompt && (
        <HomeConnectionPrompt onOpenConnectHome={openConnectHome} />
      )}
      {(showConnectHome || (isSignedIn && currentHomeId)) && (
        <HomeConnectionDialog
          open={showConnectHome}
          onOpenChange={closeConnectHome}
          currentHomeId={currentHomeId}
        />
      )}
    </>
  );
}
