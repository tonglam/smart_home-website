"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAutomation } from "@/hooks/automation/useAutomation";
import { AutomationModeItem } from "./AutomationModeItem";

export function AutomationSection() {
  const { modes, isLoading, handleModeToggle } = useAutomation();

  // Check if any mode is currently active
  const hasActiveMode = modes.some((mode) => mode.active);

  return (
    <Card className="col-span-4 lg:col-span-2">
      <CardHeader>
        <CardTitle>Automation</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {modes.map((mode) => (
          <AutomationModeItem
            key={mode.id}
            mode={mode}
            isDisabled={hasActiveMode && !mode.active && !isLoading}
            isLoading={isLoading}
            onModeClick={handleModeToggle}
          />
        ))}
      </CardContent>
    </Card>
  );
}
