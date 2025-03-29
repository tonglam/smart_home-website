"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/utils";
import type { TabValue } from "@/types/dashboard.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function DashboardTabNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get("tab") as TabValue) || "overview";
  const [isChangingTab, setIsChangingTab] = useState(false);
  const [loadingTab, setLoadingTab] = useState<TabValue | null>(null);

  const handleTabChange = (value: TabValue) => {
    if (value === currentTab) return;

    setIsChangingTab(true);
    setLoadingTab(value);

    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(`?${params.toString()}`);

    // Reset loading state after navigation is likely complete
    setTimeout(() => {
      setIsChangingTab(false);
      setLoadingTab(null);
    }, 1000); // Adjust timing as needed
  };

  return (
    <TabsList
      className="grid w-full grid-cols-3"
      role="tablist"
      aria-label="Dashboard navigation"
    >
      {[
        { value: "overview" as TabValue, label: "Overview" },
        { value: "monitoring" as TabValue, label: "Monitoring" },
        { value: "analytics" as TabValue, label: "Analytics" },
      ].map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          onClick={() => handleTabChange(tab.value)}
          className={cn(
            "relative overflow-hidden",
            "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "transition-all duration-300 ease-in-out",
            loadingTab === tab.value &&
              "after:absolute after:inset-x-0 after:bottom-0 after:h-[2px]",
            loadingTab === tab.value &&
              "after:bg-gradient-to-r after:from-primary/40 after:via-primary after:to-primary/40",
            loadingTab === tab.value && "after:animate-progress-indeterminate",
            isChangingTab && tab.value !== loadingTab && "opacity-50"
          )}
          disabled={isChangingTab}
        >
          {tab.label}
          {loadingTab === tab.value && (
            <span className="absolute top-0 left-0 right-0 h-full bg-primary/5 animate-pulse" />
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
