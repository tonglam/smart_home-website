"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { memo, useCallback, useEffect, useRef } from "react";
import type { TabNavigationProps, TabValue } from "../types";

interface TabItem {
  value: TabValue;
  label: string;
  description: string;
  shortcut: string;
}

const TAB_ITEMS: readonly TabItem[] = [
  {
    value: "overview",
    label: "Overview",
    description: "View all connected devices and their status",
    shortcut: "Alt+1",
  },
  {
    value: "monitoring",
    label: "Monitoring",
    description: "Monitor device performance and health",
    shortcut: "Alt+2",
  },
  {
    value: "analytics",
    label: "Analytics",
    description: "View analytics and insights about your devices",
    shortcut: "Alt+3",
  },
] as const;

/**
 * TabNavigation component for managing tab selection and keyboard navigation
 */
export const TabNavigation = memo(
  ({
    currentTab,
    onTabChange,
    className,
    ...props
  }: TabNavigationProps &
    Omit<
      HTMLAttributes<HTMLDivElement>,
      keyof TabNavigationProps
    >): JSX.Element => {
    const tabsRef = useRef<HTMLDivElement>(null);

    const handleTabSwitch = useCallback(
      (tab: Element) => {
        const value = tab.getAttribute("data-value");
        if (value && onTabChange) {
          onTabChange(value as TabValue);
          requestAnimationFrame(() => {
            (tab as HTMLElement).focus();
          });
        }
      },
      [onTabChange]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        const tabs = Array.from(
          tabsRef.current?.querySelectorAll('[role="tab"]') || []
        );
        const currentIndex = tabs.findIndex(
          (tab) => tab.getAttribute("data-value") === currentTab
        );

        // Handle keyboard shortcuts (Alt + number)
        if (event.altKey && /^[1-3]$/.test(event.key)) {
          event.preventDefault();
          const index = parseInt(event.key, 10) - 1;
          const tab = tabs[index];
          if (tab) handleTabSwitch(tab);
          return;
        }

        switch (event.key) {
          case "ArrowLeft":
          case "ArrowUp": {
            event.preventDefault();
            const prevIndex =
              currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
            const prevTab = tabs[prevIndex];
            if (prevTab) handleTabSwitch(prevTab);
            break;
          }
          case "ArrowRight":
          case "ArrowDown": {
            event.preventDefault();
            const nextIndex =
              currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
            const nextTab = tabs[nextIndex];
            if (nextTab) handleTabSwitch(nextTab);
            break;
          }
          case "Home": {
            event.preventDefault();
            const firstTab = tabs[0];
            if (firstTab) handleTabSwitch(firstTab);
            break;
          }
          case "End": {
            event.preventDefault();
            const lastTab = tabs[tabs.length - 1];
            if (lastTab) handleTabSwitch(lastTab);
            break;
          }
        }
      },
      [currentTab, handleTabSwitch]
    );

    // Focus management
    useEffect(() => {
      const tabsElement = tabsRef.current;
      if (!tabsElement) return;

      const currentTabElement = tabsElement.querySelector(
        `[data-value="${currentTab}"]`
      );
      if (currentTabElement && document.activeElement !== currentTabElement) {
        requestAnimationFrame(() => {
          (currentTabElement as HTMLElement).focus();
        });
      }
    }, [currentTab]);

    return (
      <TabsList
        ref={tabsRef}
        className={cn("grid w-full grid-cols-3", className)}
        onKeyDown={handleKeyDown}
        role="tablist"
        aria-label="Dashboard navigation"
        {...props}
      >
        {TAB_ITEMS.map(({ value, label, description, shortcut }) => (
          <TabsTrigger
            key={value}
            value={value}
            className={cn(
              "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "transition-colors duration-200"
            )}
            role="tab"
            aria-selected={currentTab === value}
            aria-controls={`${value}-content`}
            id={`${value}-tab`}
            tabIndex={currentTab === value ? 0 : -1}
            aria-label={`${description} (${shortcut})`}
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    );
  }
);

TabNavigation.displayName = "TabNavigation";
