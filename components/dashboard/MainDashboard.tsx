"use client";

import { updateUserHomeId } from "@/app/actions/user";
import { DeviceActivityFeed } from "@/components/dashboard/activities/ActivityFeed";
import {
  ConnectionDialog,
  ConnectionPrompt,
} from "@/components/dashboard/home-connection";
import { MainTabs } from "@/components/dashboard/tabs/MainTabs";
import { UserWelcomeBanner } from "@/components/dashboard/welcome/UserWelcomeBanner";
import { MainLayout } from "@/components/layout";
import { useClerk, useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

// LoadingState component for better reusability
const LoadingState = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Loading...</div>
  </div>
);

// MainContent component handling the main content area
const DashboardMainContent = ({
  isHomeConnected,
  isLoading,
}: {
  isHomeConnected: boolean;
  isLoading: boolean;
}) => (
  <main className={`flex-1 ${!isHomeConnected && !isLoading ? "blur-sm" : ""}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      <UserWelcomeBanner />
      <MainTabs />
      <DeviceActivityFeed />
    </div>
  </main>
);

export function MainDashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [isHomeConnected, setIsHomeConnected] = useState(false);
  const [showConnectHome, setShowConnectHome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to check home connection status from Clerk metadata
  const checkHomeConnection = useCallback(async () => {
    if (!isLoaded) return;
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      await user.reload();
      const clerkHomeId = user.publicMetadata.homeId;
      setIsHomeConnected(!!clerkHomeId && clerkHomeId !== "");
    } catch (error) {
      console.error("Error checking home connection:", error);
      setIsHomeConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  // Get current home ID from Clerk metadata
  const getCurrentHomeId = useCallback(() => {
    if (!user?.id) return undefined;
    return user.publicMetadata?.homeId as string | undefined;
  }, [user?.id, user?.publicMetadata?.homeId]);

  // Check connection status when Clerk data is loaded or metadata changes
  useEffect(() => {
    if (isLoaded) {
      checkHomeConnection();
    }
  }, [isLoaded, checkHomeConnection]);

  const handleSignIn = useCallback(() => {
    openSignIn();
  }, [openSignIn]);

  const handleHomeConnect = useCallback(
    async (homeId: string) => {
      if (!user?.id) return;

      try {
        const result = await updateUserHomeId(user.id, homeId);
        if (!result.success) {
          throw new Error("Failed to update user metadata");
        }
        setIsHomeConnected(true);
        setShowConnectHome(false);
      } catch (error) {
        console.error("Error connecting home:", error);
        setIsHomeConnected(false);
      }
    },
    [user?.id]
  );

  const handleOpenConnectHome = useCallback(() => {
    if (user?.id) {
      setShowConnectHome(true);
    } else {
      handleSignIn();
    }
  }, [user?.id, handleSignIn]);

  if (!isLoaded) return <LoadingState />;

  return (
    <MainLayout
      isSignedIn={isSignedIn}
      isHomeConnected={isHomeConnected}
      onOpenConnectHome={handleOpenConnectHome}
    >
      <ConnectionDialog
        open={showConnectHome}
        onOpenChange={setShowConnectHome}
        onConnect={handleHomeConnect}
        currentHomeId={getCurrentHomeId()}
      />

      {!isHomeConnected && !isLoading && (
        <ConnectionPrompt onOpenConnectHome={handleOpenConnectHome} />
      )}

      <main
        className="flex-1 flex items-center justify-center py-12 px-4"
        role="main"
        aria-labelledby="dashboard-title"
      >
        <div className="w-full max-w-7xl">
          <DashboardMainContent
            isHomeConnected={isHomeConnected}
            isLoading={isLoading}
          />
        </div>
      </main>
    </MainLayout>
  );
}
