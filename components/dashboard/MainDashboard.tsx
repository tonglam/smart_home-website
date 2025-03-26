"use client";

import { updateUserHomeId } from "@/app/actions/user";
import { ActivitiesFeed } from "@/components/ActivitiesFeed";
import ConnectHomeDialog from "@/components/ConnectHomeDialog";
import { Footer } from "@/components/Footer";
import { HomeConnectionPrompt } from "@/components/HomeConnectionPrompt";
import { MainTabs } from "@/components/MainTabs";
import { Navbar } from "@/components/navigation/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { useClerk, useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

// LoadingState component for better reusability
const LoadingState = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Loading...</div>
  </div>
);

// MainContent component handling the main content area
const MainContent = ({
  isHomeConnected,
  isLoading,
}: {
  isHomeConnected: boolean;
  isLoading: boolean;
}) => (
  <main className={`flex-1 ${!isHomeConnected && !isLoading ? "blur-sm" : ""}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      <WelcomeBanner />
      <MainTabs />
      <ActivitiesFeed />
    </div>
  </main>
);

// UserHomeConnection component to manage home connection state and logic
export const MainDashboard = () => {
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const [isHomeConnected, setIsHomeConnected] = useState(false);
  const [showConnectHome, setShowConnectHome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to check home connection status from Clerk metadata
  const checkHomeConnection = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      // Force refresh user data to get latest metadata
      await user.reload();

      // Check Clerk's public metadata
      const clerkHomeId = user.publicMetadata.homeId;

      if (clerkHomeId && clerkHomeId !== "") {
        setIsHomeConnected(true);
      } else {
        setIsHomeConnected(false);
      }
    } catch (error) {
      console.error("Error checking home connection:", error);
      setIsHomeConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  // Get current home ID from Clerk metadata
  const getCurrentHomeId = () => {
    if (!user?.id) return undefined;
    return user.publicMetadata?.homeId as string | undefined;
  };

  // Check connection status when Clerk data is loaded or metadata changes
  useEffect(() => {
    if (isLoaded) {
      checkHomeConnection();
    }
  }, [isLoaded, checkHomeConnection]);

  const handleSignIn = () => {
    openSignIn();
  };

  const handleHomeConnect = async (homeId: string) => {
    if (!user?.id) return;

    try {
      // Update Clerk's public metadata using server action
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
  };

  const handleOpenConnectHome = () => {
    if (user?.id) {
      setShowConnectHome(true);
    } else {
      handleSignIn();
    }
  };

  // Show loading state while Clerk data is being loaded
  if (!isLoaded) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TooltipProvider>
        <ConnectHomeDialog
          open={showConnectHome}
          onOpenChange={setShowConnectHome}
          onConnect={handleHomeConnect}
          currentHomeId={getCurrentHomeId()}
        />

        {/* Home Connection Check */}
        {!isHomeConnected && !isLoading && (
          <HomeConnectionPrompt onOpenConnectHome={handleOpenConnectHome} />
        )}

        {/* Navbar */}
        <Navbar
          isSignedIn={!!user?.id}
          isHomeConnected={isHomeConnected}
          onOpenConnectHome={handleOpenConnectHome}
        />

        <MainContent isHomeConnected={isHomeConnected} isLoading={isLoading} />

        {/* Footer */}
        <Footer />
      </TooltipProvider>
    </div>
  );
};
