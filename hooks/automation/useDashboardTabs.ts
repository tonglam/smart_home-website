import type {
  GtagEvent,
  TabSwitchEvent,
  TabValue,
} from "@/components/dashboard/types";
import { useCallback, useEffect, useState } from "react";

const TAB_STORAGE_KEY = "dashboard-active-tab";
const PERFORMANCE_THRESHOLD = 100; // ms

interface UseDashboardTabsOptions {
  /** Initial active tab (defaults to "overview") */
  defaultTab?: TabValue;
  /** Callback fired when a tab is changed */
  onTabChange?: (tab: TabValue) => void;
  /** Whether to persist tab selection in localStorage (defaults to true) */
  persistTab?: boolean;
}

declare global {
  interface Window {
    gtag?: (
      command: GtagEvent["command"],
      action: GtagEvent["action"],
      params: GtagEvent["params"]
    ) => void;
  }
}

/**
 * Custom hook for managing dashboard tab state with persistence and performance monitoring
 * @param options Configuration options for the hook
 * @returns Object containing current tab and tab change handler
 */
export function useDashboardTabs({
  defaultTab = "overview",
  onTabChange,
  persistTab = true,
}: UseDashboardTabsOptions = {}) {
  // Initialize with stored value or default
  const [currentTab, setCurrentTab] = useState<TabValue>(() => {
    if (!persistTab) return defaultTab;

    try {
      const stored = localStorage.getItem(TAB_STORAGE_KEY);
      // Validate stored value is a valid TabValue
      return isValidTabValue(stored) ? stored : defaultTab;
    } catch {
      return defaultTab;
    }
  });

  // Persist tab selection
  useEffect(() => {
    if (persistTab) {
      try {
        localStorage.setItem(TAB_STORAGE_KEY, currentTab);
      } catch (error) {
        console.error("Failed to persist tab selection:", error);
      }
    }
  }, [currentTab, persistTab]);

  const handleTabChange = useCallback(
    (tab: TabValue) => {
      // Start performance measurement
      const startTime = performance.now();

      // Update tab state
      setCurrentTab(tab);
      onTabChange?.(tab);

      // Measure and log performance
      const endTime = performance.now();
      const switchTime = endTime - startTime;

      // Log performance metrics if taking longer than threshold
      if (switchTime > PERFORMANCE_THRESHOLD) {
        console.warn(`Tab switch to ${tab} took ${switchTime.toFixed(2)}ms`);
      }

      // Report to analytics if available
      if (typeof window !== "undefined" && window.gtag) {
        const eventParams: TabSwitchEvent = {
          tab_name: tab,
          switch_time: switchTime,
        };

        window.gtag("event", "tab_switch", eventParams);
      }
    },
    [onTabChange]
  );

  return {
    currentTab,
    handleTabChange,
  };
}

/**
 * Type guard to validate if a value is a valid TabValue
 */
function isValidTabValue(value: string | null): value is TabValue {
  if (!value) return false;
  return ["overview", "monitoring", "analytics"].includes(value);
}
