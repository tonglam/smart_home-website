"use client";

import { cn } from "@/lib/utils/utils";
import { TabValue } from "@/types/dashboard.types";
import { useEffect, useState } from "react";

interface TabContentWrapperProps {
  children: React.ReactNode;
  activeTab: TabValue;
  targetTab: TabValue;
}

export function TabContentWrapper({
  children,
  activeTab,
  targetTab,
}: TabContentWrapperProps) {
  const [shouldRender, setShouldRender] = useState(activeTab === targetTab);
  const isActive = activeTab === targetTab;

  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
    } else if (shouldRender) {
      setShouldRender(false);
    }
  }, [isActive, shouldRender]);

  if (!shouldRender) {
    return null;
  }

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
