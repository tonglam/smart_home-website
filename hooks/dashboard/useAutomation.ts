"use client";

import {
  AutomationMode,
  toggleAutomationMode,
} from "@/app/actions/dashboard/automation.action";
import { useState } from "react";
import { toast } from "sonner";

export function useAutomation(
  initialCurrentMode: string | null,
  homeId: string
) {
  const [optimisticCurrentMode, setOptimisticCurrentMode] = useState<
    string | null
  >(initialCurrentMode);
  const [isLoading, setIsLoading] = useState(false);

  const handleModeToggle = async (clickedMode: AutomationMode) => {
    if (!homeId || isLoading) {
      console.log("(Hook) Exiting early due to missing homeId or isLoading.");
      return;
    }

    const originalMode = optimisticCurrentMode;
    const isClickedModeCurrentlyActive = clickedMode.id === originalMode;
    const optimisticNextMode = isClickedModeCurrentlyActive
      ? null
      : clickedMode.id;

    setOptimisticCurrentMode(optimisticNextMode);
    setIsLoading(true);

    try {
      const success = await toggleAutomationMode(homeId, optimisticNextMode);

      if (!success) {
        throw new Error("Server action failed to toggle mode.");
      }

      if (isClickedModeCurrentlyActive) {
        toast.success(`${clickedMode.name} deactivated`);
      } else {
        toast.success(`Mode set to ${clickedMode.name}`);
      }
    } catch (error) {
      console.error("(Hook) Error toggling mode catch block:", error);
      setOptimisticCurrentMode(originalMode);
      toast.error(`Failed to toggle ${clickedMode.name}. Reverted change.`);
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
