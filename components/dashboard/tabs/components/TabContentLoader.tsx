"use client";

import { ErrorBoundary } from "@/components/dashboard/ErrorBoundary";
import dynamic from "next/dynamic";
import { Suspense, memo } from "react";
import type { TabValue } from "../../types";
import { TabLoading } from "./TabLoading";

const TAB_COMPONENTS = {
  overview: dynamic(
    () => import("../../home/SmartHomeGrid").then((mod) => mod.SmartHomeGrid),
    { loading: () => <TabLoading /> }
  ),
  monitoring: dynamic(
    () =>
      import("../MonitoringContent").then((mod) => {
        const WrappedMonitoring = () => <mod.MonitoringContent />;
        WrappedMonitoring.displayName = "WrappedMonitoring";
        return WrappedMonitoring;
      }),
    { loading: () => <TabLoading /> }
  ),
  analytics: dynamic(
    () =>
      import("@/components/analytics/AnalyticsOverview").then(
        (mod) => mod.AnalyticsOverview
      ),
    { loading: () => <TabLoading /> }
  ),
} as const;

interface TabContentLoaderProps {
  tab: TabValue;
}

export const TabContentLoader = memo(({ tab }: TabContentLoaderProps) => {
  const Component = TAB_COMPONENTS[tab];

  if (!Component) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        This tab is currently unavailable
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<TabLoading />}>
        <div className="space-y-4" role="region" aria-label={`${tab} content`}>
          <Component />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
});

TabContentLoader.displayName = "TabContentLoader";
