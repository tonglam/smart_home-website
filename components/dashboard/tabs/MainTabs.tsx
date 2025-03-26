"use client";

import { ErrorBoundary } from "@/components/dashboard/ErrorBoundary";
import { useDashboardTabs } from "@/components/dashboard/hooks/useDashboardTabs";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { DashboardTabsProps, TabValue } from "../types";
import { TabNavigation } from "./TabNavigation";
import { TabContentLoader } from "./components/TabContentLoader";

/**
 * Main dashboard tabs component that manages tab state and renders tab content
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

  return (
    <ErrorBoundary>
      <Tabs
        defaultValue={defaultTab}
        value={currentTab}
        onValueChange={(value) => handleTabChange(value as TabValue)}
        className={cn("space-y-4", className)}
        aria-label="Dashboard sections"
      >
        <TabNavigation
          currentTab={currentTab}
          onTabChange={handleTabChange}
          aria-controls={`${currentTab}-content`}
        />
        <TabContentLoader tab={currentTab} />
      </Tabs>
    </ErrorBoundary>
  );
}
