"use client";

import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { ErrorBoundary } from "@/components/dashboard/ErrorBoundary";
import { SmartHomeGridOptimized } from "@/components/dashboard/home/SmartHomeGridOptimized";
import { useDashboardTabs } from "@/components/dashboard/hooks/useDashboardTabs";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { memo, Suspense, useCallback } from "react";
import type { DashboardTabsProps, TabValue } from "../types";
import { TabNavigation } from "./TabNavigation";

/**
 * Loading state component for tab content
 */
const TabLoading = memo(() => (
  <Card className="p-4" aria-busy="true" role="status">
    <div className="h-32 animate-pulse bg-muted rounded-md">
      <span className="sr-only">Loading content...</span>
    </div>
  </Card>
));
TabLoading.displayName = "TabLoading";

// Dynamically import heavy components
const MonitoringContent = dynamic(
  () => import("./MonitoringContent").then((mod) => mod.MonitoringContent),
  {
    loading: () => <TabLoading />,
    ssr: false,
  }
);

/**
 * Overview tab content component
 */
const OverviewTab = memo(() => (
  <ErrorBoundary>
    <Suspense fallback={<TabLoading />}>
      <div className="space-y-4" role="region" aria-label="Device Overview">
        <SmartHomeGridOptimized />
      </div>
    </Suspense>
  </ErrorBoundary>
));
OverviewTab.displayName = "OverviewTab";

/**
 * Monitoring tab content component with lazy loading
 */
const MonitoringTab = memo(() => (
  <ErrorBoundary>
    <div className="space-y-6" role="region" aria-label="Device Monitoring">
      <MonitoringContent />
    </div>
  </ErrorBoundary>
));
MonitoringTab.displayName = "MonitoringTab";

/**
 * Analytics tab content component with lazy loading
 */
const AnalyticsTab = memo(() => (
  <ErrorBoundary>
    <Suspense fallback={<TabLoading />}>
      <div className="space-y-4" role="region" aria-label="Device Analytics">
        <AnalyticsOverview />
      </div>
    </Suspense>
  </ErrorBoundary>
));
AnalyticsTab.displayName = "AnalyticsTab";

const TAB_COMPONENTS: Record<TabValue, React.FC> = {
  overview: OverviewTab,
  monitoring: MonitoringTab,
  analytics: AnalyticsTab,
};

interface TabContentProps {
  value: TabValue;
  Component: React.FC;
}

/**
 * Memoized tab content wrapper component
 */
const TabContent = memo(({ value, Component }: TabContentProps) => {
  const renderContent = useCallback(() => <Component />, [Component]);

  return (
    <TabsContent
      key={value}
      value={value}
      role="tabpanel"
      aria-labelledby={`${value}-tab`}
      tabIndex={0}
      className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {renderContent()}
    </TabsContent>
  );
});
TabContent.displayName = "TabContent";

/**
 * Main dashboard tabs component that manages tab state and renders tab content
 * @param props Component props
 * @returns Dashboard tabs component
 */
export function MainTabs({
  defaultTab = "overview",
  className,
  onTabChange,
  persistTab,
}: DashboardTabsProps) {
  const { currentTab, handleTabChange } = useDashboardTabs({
    defaultTab,
    onTabChange,
    persistTab,
  });

  const handleValueChange = (value: string) =>
    handleTabChange(value as TabValue);

  return (
    <ErrorBoundary>
      <Tabs
        defaultValue={defaultTab}
        value={currentTab}
        onValueChange={handleValueChange}
        className={cn("space-y-4", className)}
        aria-label="Dashboard sections"
      >
        <TabNavigation
          currentTab={currentTab}
          onTabChange={handleTabChange}
          aria-controls={`${currentTab}-content`}
        />

        {Object.entries(TAB_COMPONENTS).map(([value, Component]) => (
          <TabContent
            key={value}
            value={value as TabValue}
            Component={Component}
          />
        ))}
      </Tabs>
    </ErrorBoundary>
  );
}
