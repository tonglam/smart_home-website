"use client";

import { TabsContent } from "@/components/ui/tabs";
import type { Alert, TabValue } from "@/types/dashboard.types";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { TabContentWrapper } from "./TabContentWrapper";
import { TabSkeleton } from "./TabSkeleton";

// Dynamically import tabs with no SSR
const DynamicAnalyticsTab = dynamic(
  () => import("../analytics/AnalyticsTab").then((mod) => mod.AnalyticsTab),
  { ssr: false }
);
const DynamicMonitoringTab = dynamic(
  () => import("../monitoring/MonitoringTab").then((mod) => mod.MonitoringTab),
  { ssr: false }
);

interface DynamicTabsProps {
  activeTab: TabValue;
  alerts: Alert[];
}

export function DynamicTabs({ activeTab, alerts }: DynamicTabsProps) {
  return (
    <>
      {/* Monitoring Tab - Client-side only */}
      <TabContentWrapper activeTab={activeTab} targetTab="monitoring">
        <Suspense fallback={<TabSkeleton type="monitoring" />}>
          <TabsContent
            value="monitoring"
            className="space-y-6 focus-visible:outline-none focus-visible:ring-0"
          >
            <DynamicMonitoringTab alerts={alerts} />
          </TabsContent>
        </Suspense>
      </TabContentWrapper>

      {/* Analytics Tab - Client-side only */}
      <TabContentWrapper activeTab={activeTab} targetTab="analytics">
        <Suspense fallback={<TabSkeleton type="analytics" />}>
          <TabsContent
            value="analytics"
            className="space-y-6 focus-visible:outline-none focus-visible:ring-0"
          >
            <DynamicAnalyticsTab />
          </TabsContent>
        </Suspense>
      </TabContentWrapper>
    </>
  );
}
