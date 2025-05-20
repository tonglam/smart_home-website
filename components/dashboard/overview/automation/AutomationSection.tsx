"use client";

import { AutomationMode } from "@/app/actions/dashboard/automation.action";
import { useAutomation } from "@/hooks/dashboard/useAutomation";
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
  const { optimisticCurrentMode, handleModeToggle } = useAutomation({
    homeId,
    initialCurrentMode,
  });

  return (
    <div className="space-y-4">
      {modes.map((mode) => (
        <AutomationModeCard
          key={mode.id}
          mode={mode}
          currentMode={optimisticCurrentMode}
          handleModeToggle={handleModeToggle}
        />
      ))}
    </div>
  );
}
