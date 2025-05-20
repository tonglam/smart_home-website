"use client";

import {
  AutomationMode,
  toggleAutomationMode,
} from "@/app/actions/dashboard/automation.action";
import { useState } from "react";
import { toast } from "sonner";

interface UseAutomationProps {
  homeId: string;
  initialCurrentMode: string | null;
}

export function useAutomation({
  homeId,
  initialCurrentMode,
}: UseAutomationProps) {
  const [optimisticCurrentMode, setOptimisticCurrentMode] = useState<string>(
    initialCurrentMode || "home"
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleModeToggle = async (clickedMode: AutomationMode) => {
    if (isLoading) return;
    setIsLoading(true);

    const originalMode = optimisticCurrentMode;

    try {
      if (clickedMode.id === originalMode) {
        setIsLoading(false);
        return;
      }

      setOptimisticCurrentMode(clickedMode.id);

      const success = await toggleAutomationMode(homeId, clickedMode.id);

      if (!success) {
        throw new Error("Server action failed to toggle mode.");
      }

      toast.success(`Mode set to ${clickedMode.name}`);
    } catch (error) {
      console.error("(Hook) Error toggling mode catch block:", error);
      setOptimisticCurrentMode(originalMode);
      toast.error(
        `Failed to set mode to ${clickedMode.name}. Reverted change.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    optimisticCurrentMode,
    isLoading,
    handleModeToggle,
  };
}
