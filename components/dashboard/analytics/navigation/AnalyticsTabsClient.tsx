"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AnalyticsTabsClient() {
  return (
    <TabsList>
      <TabsTrigger value="devices">Devices</TabsTrigger>
      <TabsTrigger value="security">Security</TabsTrigger>
    </TabsList>
  );
}
