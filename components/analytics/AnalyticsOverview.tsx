'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeviceUsageChart } from "./DeviceUsageChart";
import { SecurityEventsChart } from "./SecurityEventsChart";
import { Calculator, LogIn } from "lucide-react";

interface AnalyticsOverviewProps {
  isHomeConnected: boolean;
  isSignedIn: boolean;
  onOpenConnectHome: () => void;
  onSignIn: () => void;
}

export function AnalyticsOverview({ 
  isHomeConnected, 
  isSignedIn,
  onOpenConnectHome,
  onSignIn 
}: AnalyticsOverviewProps) {
  if (!isHomeConnected) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Calculator className="h-12 w-12 text-muted-foreground mb-2" />
          <CardTitle className="text-xl">Analytics Unavailable</CardTitle>
          <CardDescription className="max-w-md mx-auto">
            {isSignedIn 
              ? "Connect your home to view detailed analytics and insights about your smart home usage and energy consumption."
              : "Sign in and connect your home to view detailed analytics and insights about your smart home usage and energy consumption."}
          </CardDescription>
          <div className="pt-4">
            {isSignedIn ? (
              <Button onClick={onOpenConnectHome}>
                Connect Home
              </Button>
            ) : (
              <Button onClick={onSignIn}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Analytics & Insights</h2>
          <p className="text-sm text-muted-foreground">
            Analyze your smart home usage, monitor energy consumption, and discover optimization opportunities.
          </p>
        </div>
      </div>
        
      {/* Main Analytics */}
      <div className="space-y-6">
        <Tabs defaultValue="devices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="devices" className="space-y-6">
            <DeviceUsageChart />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Device Health Status</CardTitle>
                <CardDescription>
                  Monitoring the health of your connected devices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'Living Room Light', status: 'Good', battery: '100%', lastUpdated: '2 hours ago' },
                    { name: 'Kitchen Motion Sensor', status: 'Warning', battery: '15%', lastUpdated: '1 day ago' },
                    { name: 'Front Door Lock', status: 'Good', battery: '85%', lastUpdated: '5 hours ago' },
                    { name: 'Office Camera', status: 'Good', battery: 'N/A', lastUpdated: 'Just now' },
                  ].map((device) => (
                    <div key={device.name} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className={`h-3 w-3 rounded-full ${device.status === 'Good' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <div>
                        <p className="font-medium text-sm">{device.name}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>Battery: {device.battery}</span>
                          <span>•</span>
                          <span>Updated: {device.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <SecurityEventsChart />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Security Recommendations</CardTitle>
                <CardDescription>
                  Personalized suggestions to improve your home security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Calculator className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">Update Window Sensors</h3>
                      <p className="text-sm text-muted-foreground">
                        Your living room window sensor reports frequent status changes.
                        Consider checking the battery or replacing it for more reliable monitoring.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Calculator className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">Activate Away Mode More Often</h3>
                      <p className="text-sm text-muted-foreground">
                        Based on your usage patterns, you could benefit from using the "Away Mode" 
                        automation more frequently when you're not at home.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}