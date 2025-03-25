'use client';

import { useState, useEffect } from 'react';
import { homeCache } from '@/lib/homeCache';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ConnectHomeDialog } from '@/components/ConnectHomeDialog';
import { WelcomeBanner } from '@/components/WelcomeBanner';
import { Navbar } from '@/components/Navbar';
import { HomeConnectionPrompt } from '@/components/HomeConnectionPrompt';
import { MainTabs } from '@/components/MainTabs';
import { ActivitiesFeed } from '@/components/ActivitiesFeed';
import { Footer } from '@/components/Footer';

export default function Dashboard() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isHomeConnected, setIsHomeConnected] = useState(false);
  const [showConnectHome, setShowConnectHome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking home connection status
    const checkHomeConnection = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const cachedHomeId = homeCache.getHomeId();
        if (cachedHomeId) {
          setIsHomeConnected(true);
        }
      } catch (error) {
        console.error('Error checking home connection:', error);
      }
      setIsLoading(false);
    };
    checkHomeConnection();
  }, []);

  const handleSignIn = () => setIsSignedIn(true);
  const handleSignOut = () => {
    setIsSignedIn(false);
    homeCache.clearCache();
    setIsHomeConnected(false);
  };
  
  const handleHomeConnect = (homeId: string) => {
    setIsHomeConnected(true);
    setShowConnectHome(false);
  };

  const handleOpenConnectHome = () => {
    if (isSignedIn) {
      setShowConnectHome(true);
    } else {
      // Could show a toast notification here that login is required
    }
  };

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
            isSignedIn={isSignedIn}
            onOpenConnectHome={handleOpenConnectHome}
            onSignIn={handleSignIn}
          />
        )}

        {/* Navbar */}
        <Navbar 
          isSignedIn={isSignedIn} 
          isHomeConnected={isHomeConnected}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          onOpenConnectHome={handleOpenConnectHome}
        />

        {/* Main Content */}
        <main className={`flex-1 ${!isHomeConnected && !isLoading ? 'blur-sm' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
            {/* Welcome Banner */}
            <WelcomeBanner />

            {/* Main Content Tabs */}
            <MainTabs 
              isHomeConnected={isHomeConnected} 
              isSignedIn={isSignedIn}
              onOpenConnectHome={handleOpenConnectHome}
              onSignIn={handleSignIn}
            />

            {/* Recent Activities Feed */}
            <ActivitiesFeed 
              isHomeConnected={isHomeConnected}
              isSignedIn={isSignedIn}
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