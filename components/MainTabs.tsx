"use client";

import { SmartHomeGrid } from "@/components/SmartHomeGrid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useState } from "react";
import { HiX } from "react-icons/hi";
import { HiVideoCamera } from "react-icons/hi2";
import { IoMdPulse } from "react-icons/io";
import { AnalyticsOverview } from "./analytics/AnalyticsOverview";

export function MainTabs() {
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
        <SmartHomeGrid />
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
                <HiX className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 mb-3">
                <IoMdPulse className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold text-lg">Critical Alerts</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  No critical alerts at this time
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Camera Feeds Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Real-time Camera</h3>
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <Card className="overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HiVideoCamera className="h-5 w-5" />
                    <span>Front Door Camera</span>
                  </div>
                  <span className="text-sm text-green-500">Live</span>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video">
                  <Image
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                    alt="Front Door Camera Feed"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <Button
                  size="icon"
                  className="absolute bottom-4 right-4 h-12 w-12 rounded-full"
                  onClick={() => window.open("tel:+1234567890")}
                >
                  <IoMdPulse className="h-6 w-6" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <AnalyticsOverview />
      </TabsContent>
    </Tabs>
  );
}
