"use client";

import { AutomationMode } from "@/app/actions/dashboard/automation.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAutomation } from "@/hooks/dashboard/useAutomation";
import { Light } from "@/types/dashboard.types";
import { Wand2 } from "lucide-react";
import { AutomationModeCard } from "./AutomationModeCard";

interface AutomationSectionProps {
  lightDevices: Light[];
  modes: AutomationMode[];
  currentMode: string | null;
  homeId: string;
}

export function AutomationSection({
  lightDevices,
  modes,
  currentMode: initialCurrentMode,
  homeId,
}: AutomationSectionProps) {
  const { optimisticCurrentMode, isLoading, handleModeToggle } = useAutomation(
    initialCurrentMode,
    homeId
  );

  if (lightDevices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            Automation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No light devices found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Wand2 className="h-5 w-5" />
          Automation
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          {modes.map((mode) => (
            <AutomationModeCard
              key={mode.id}
              mode={mode}
              currentMode={optimisticCurrentMode}
              isLoading={isLoading}
              handleModeToggle={handleModeToggle}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
