"use client";

import { ErrorBoundary } from "@/components/dashboard/ErrorBoundary";
import dynamic from "next/dynamic";
import { Suspense, memo } from "react";
import type { TabValue } from "../../types";
import { TabLoading } from "./TabLoading";

const TAB_COMPONENTS = {
  overview: dynamic(
    () =>
      import("../../home/SmartHomeGridOptimized").then(
        (mod) => mod.SmartHomeGridOptimized
      ),
    { loading: () => <TabLoading /> }
  ),
  monitoring: dynamic(
    () => import("../MonitoringContent").then((mod) => mod.MonitoringContent),
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
