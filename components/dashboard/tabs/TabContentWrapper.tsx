"use client";

import { cn } from "@/lib/utils/utils";
import { TabValue } from "@/types/dashboard.types";
import { useEffect, useState } from "react";

interface TabContentWrapperProps {
  children: React.ReactNode;
  activeTab: TabValue;
  targetTab: TabValue;
}

/**
 * Client-side wrapper to efficiently handle tab content rendering
 * This avoids constantly re-rendering inactive tabs
 * while providing immediate visual feedback
 */
export function TabContentWrapper({
  children,
  activeTab,
  targetTab,
}: TabContentWrapperProps) {
  const [shouldRender, setShouldRender] = useState(activeTab === targetTab);
  const isActive = activeTab === targetTab;

  useEffect(() => {
    // When this tab becomes active, render it
    if (isActive) {
      setShouldRender(true);
    }

    // If was active but now isn't, hide it after delay
    // This allows animations to complete
    if (!isActive && shouldRender) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // Keep content around briefly to allow animations

      return () => clearTimeout(timer);
    }
  }, [isActive, shouldRender]);

  // Conditionally render based on whether this tab is or was recently active
  if (!shouldRender) {
    return null;
  }

  // Show content with conditional styling
  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out origin-top-left w-full",
        isActive
          ? "opacity-100 translate-y-0 scale-100 bg-background/0"
          : "opacity-0 translate-y-8 scale-95 bg-primary/5 blur-sm absolute pointer-events-none"
      )}
      style={{
        transformOrigin: "center top",
        willChange: "transform, opacity, background-color",
      }}
    >
      {children}
    </div>
  );
}
