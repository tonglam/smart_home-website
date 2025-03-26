"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeviceHealthCard } from "./cards/DeviceHealthCard";
import { SecurityRecommendationsCard } from "./cards/SecurityRecommendationsCard";
import { DeviceModeUsageChart } from "./charts/DeviceModeUsageChart";
import { SecurityEventsChart } from "./charts/SecurityEventsChart";

// Analytics tabs component
const AnalyticsTabs = () => (
  <TabsList>
    <TabsTrigger value="devices">Devices</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
  </TabsList>
);

// Devices tab content
const DevicesTabContent = () => (
  <TabsContent value="devices" className="space-y-6">
    <DeviceModeUsageChart />
    <DeviceHealthCard />
  </TabsContent>
);

// Security tab content
const SecurityTabContent = () => (
  <TabsContent value="security" className="space-y-6">
    <SecurityEventsChart />
    <SecurityRecommendationsCard />
  </TabsContent>
);

// Main component
export function AnalyticsOverview() {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Tabs defaultValue="devices" className="space-y-4">
          <AnalyticsTabs />
          <DevicesTabContent />
          <SecurityTabContent />
        </Tabs>
      </div>
    </div>
  );
}
