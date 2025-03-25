'use client';

import { ContactForm } from '@/components/ContactForm';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useState, useEffect } from 'react';
import { homeCache } from '@/lib/homeCache';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import { ConnectHomeDialog } from '@/components/ConnectHomeDialog';

export default function SupportPage() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isHomeConnected, setIsHomeConnected] = useState(false);
  const [showConnectHome, setShowConnectHome] = useState(false);

  useEffect(() => {
    // Check home connection status
    const cachedHomeId = homeCache.getHomeId();
    if (cachedHomeId) {
      setIsHomeConnected(true);
    }
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
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <ConnectHomeDialog 
          open={showConnectHome} 
          onOpenChange={setShowConnectHome}
          onConnect={handleHomeConnect}
        />
        
        <Navbar 
          isSignedIn={isSignedIn} 
          isHomeConnected={isHomeConnected}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          onOpenConnectHome={handleOpenConnectHome}
        />
        
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-4xl">
            <Card className="border border-border shadow-md overflow-hidden">
              <div className="p-6 bg-muted/50 border-b">
                <h2 className="text-2xl font-semibold text-center">Contact Us</h2>
                <p className="text-center text-muted-foreground mt-2">
                  Fill out the form below and we'll get back to you shortly
                </p>
              </div>
              <div className="p-6">
                <ContactForm className="max-w-3xl mx-auto" />
              </div>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </TooltipProvider>
  );
}