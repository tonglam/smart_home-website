"use client";

import { AutomationMode } from "@/app/actions/dashboard/automation.action";
import { Skeleton } from "@/components/ui/skeleton";
import { useAutomation } from "@/hooks/dashboard/useAutomation";
import { useAuth } from "@clerk/nextjs";
import { AutomationModeCard } from "./AutomationModeCard";

interface AutomationSectionProps {
  modes: AutomationMode[];
  currentMode: string;
  homeId: string;
}

export function AutomationSection({
  modes,
  currentMode: initialCurrentMode,
  homeId,
}: AutomationSectionProps) {
  const { userId, isLoaded } = useAuth();
  const { optimisticCurrentMode, isLoading, handleModeToggle } = useAutomation({
    homeId,
    userId: userId || "",
    initialCurrentMode,
  });

  // Show skeleton while auth is loading
  if (!isLoaded) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i}>
            <Skeleton className="h-[150px] w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!userId) return null;

  return (
    <div className="space-y-4">
      {modes.map((mode) => (
        <AutomationModeCard
          key={mode.id}
          mode={mode}
          currentMode={optimisticCurrentMode || "home"}
          isLoading={isLoading}
          handleModeToggle={handleModeToggle}
        />
      ))}
    </div>
  );
}
