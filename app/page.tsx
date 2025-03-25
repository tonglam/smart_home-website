"use client";

import { ActivitiesFeed } from "@/components/ActivitiesFeed";
import { ConnectHomeDialog } from "@/components/ConnectHomeDialog";
import { Footer } from "@/components/Footer";
import { HomeConnectionPrompt } from "@/components/HomeConnectionPrompt";
import { MainTabs } from "@/components/MainTabs";
import { Navbar } from "@/components/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { homeCache } from "@/lib/homeCache";
import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { isSignedIn, user } = useUser();
  const { signOut, openSignIn } = useClerk();
  const [isHomeConnected, setIsHomeConnected] = useState(false);
  const [showConnectHome, setShowConnectHome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking home connection status
    const checkHomeConnection = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const cachedHomeId = homeCache.getHomeId(user?.id);
        if (cachedHomeId) {
          setIsHomeConnected(true);
        }
      } catch (error) {
        console.error("Error checking home connection:", error);
      }
      setIsLoading(false);
    };
    checkHomeConnection();
  }, [user?.id]);

  const handleSignIn = () => {
    openSignIn();
  };

  const handleSignOut = async () => {
    await signOut();
    homeCache.clearCache(user?.id);
    setIsHomeConnected(false);
  };

  const handleHomeConnect = (homeId: string) => {
    if (user?.id && homeCache.setHomeId(homeId, user.id)) {
      setIsHomeConnected(true);
      setShowConnectHome(false);
    }
  };

  const handleOpenConnectHome = () => {
    if (isSignedIn) {
      setShowConnectHome(true);
    } else {
      // Could show a toast notification here that login is required
    }
  };

  // Get the current Navbar component JSX
  const navbarComponent = (
    <Navbar
      isSignedIn={!!isSignedIn}
      isHomeConnected={isHomeConnected}
      onSignIn={handleSignIn}
      onSignOut={handleSignOut}
      onOpenConnectHome={handleOpenConnectHome}
    />
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TooltipProvider>
        <ConnectHomeDialog
          open={showConnectHome}
          onOpenChange={setShowConnectHome}
          onConnect={handleHomeConnect}
        />

        {/* Home Connection Check */}
        {!isHomeConnected && !isLoading && (
          <HomeConnectionPrompt
            isSignedIn={!!isSignedIn}
            onOpenConnectHome={handleOpenConnectHome}
            onSignIn={handleSignIn}
          />
        )}

        {/* Navbar - using the existing component */}
        {navbarComponent}

        {/* Main Content */}
        <main
          className={`flex-1 ${
            !isHomeConnected && !isLoading ? "blur-sm" : ""
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
            {/* Welcome Banner */}
            <WelcomeBanner />

            {/* Main Content Tabs */}
            <MainTabs
              isHomeConnected={isHomeConnected}
              isSignedIn={!!isSignedIn}
              onOpenConnectHome={handleOpenConnectHome}
              onSignIn={handleSignIn}
            />

            {/* Recent Activities Feed */}
            <ActivitiesFeed
              isHomeConnected={isHomeConnected}
              isSignedIn={!!isSignedIn}
              onOpenConnectHome={handleOpenConnectHome}
              onSignIn={handleSignIn}
            />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </TooltipProvider>
    </div>
  );
}
