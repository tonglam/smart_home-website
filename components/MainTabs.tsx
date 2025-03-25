'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SmartHomeGrid } from '@/components/SmartHomeGrid';
import { Card } from '@/components/ui/card';
import { Activity, Video, LogIn, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalyticsOverview } from './analytics/AnalyticsOverview';

interface MainTabsProps {
  isHomeConnected: boolean;
  isSignedIn: boolean;
  onOpenConnectHome: () => void;
  onSignIn: () => void;
}

export function MainTabs({ isHomeConnected, isSignedIn, onOpenConnectHome, onSignIn }: MainTabsProps) {
  const [showAlerts, setShowAlerts] = useState(true);

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <div className="relative border-b">
        <div className="max-w-[400px] sm:max-w-none overflow-x-auto scrollbar-none">
          <TabsList className="w-full sm:w-auto inline-flex h-10 items-center justify-start rounded-none bg-transparent p-0">
            <TabsTrigger 
              value="overview" 
              className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground transition-none data-[state=active]:border-primary data-[state=active]:text-foreground"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="monitoring" 
              className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground transition-none data-[state=active]:border-primary data-[state=active]:text-foreground"
            >
              Monitoring
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground transition-none data-[state=active]:border-primary data-[state=active]:text-foreground"
            >
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <TabsContent value="overview" className="space-y-4">
        {/* Device Overview Grid */}
        <SmartHomeGrid isConnected={isHomeConnected} />
      </TabsContent>

      <TabsContent value="monitoring" className="space-y-6">
        {/* Critical Alerts Section */}
        {showAlerts && (
          <Card className="border-l-4 border-l-orange-500 relative">
            <div className="p-4 sm:p-6">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 rounded-full"
                onClick={() => setShowAlerts(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold text-lg">Critical Alerts</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {isHomeConnected 
                    ? "No critical alerts at this time"
                    : isSignedIn 
                      ? "Connect your home to view alerts"
                      : "Sign in and connect your home to view alerts"}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Camera Feeds Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Real-time Camera</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <Card className="overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                  </div>
                  <span className="text-sm text-green-500">
                    {isHomeConnected ? "Live" : "Disconnected"}
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video">
                  <img 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" 
                    alt="Front Door Camera Feed"
                    className={`absolute inset-0 h-full w-full object-cover ${!isHomeConnected && 'opacity-50 grayscale'}`}
                  />
                  {!isHomeConnected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isSignedIn ? (
                        <Button variant="secondary" onClick={onOpenConnectHome}>
                          Connect to View
                        </Button>
                      ) : (
                        <Button variant="secondary" onClick={onSignIn}>
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign In to View
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                {isHomeConnected && (
                  <Button 
                    size="icon"
                    className="absolute bottom-4 right-4 h-12 w-12 rounded-full"
                    onClick={() => window.open('tel:+1234567890')}
                  >
                    <Activity className="h-6 w-6" />
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <AnalyticsOverview 
          isHomeConnected={isHomeConnected} 
          isSignedIn={isSignedIn}
          onOpenConnectHome={onOpenConnectHome}
          onSignIn={onSignIn}
        />
      </TabsContent>
    </Tabs>
  );
}