"use client";

import {
  AutomationMode,
  getAutomationModes,
  toggleAutomationMode,
} from "@/app/actions/automation";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

export function useAutomation() {
  const { toast } = useToast();
  const { user } = useUser();
  const homeId = user?.publicMetadata?.homeId as string;
  const [modes, setModes] = useState<AutomationMode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch automation modes from database
  const fetchModes = useCallback(async () => {
    if (!homeId) return;

    try {
      const updatedModes = await getAutomationModes(homeId);
      setModes(updatedModes);
    } catch (error) {
      console.error("Error fetching automation modes:", error);
      toast({
        title: "Error",
        description:
          "Failed to fetch automation modes. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [homeId, toast]);

  // Initial fetch
  useEffect(() => {
    fetchModes();
  }, [fetchModes]);

  // Handle mode activation/deactivation
  const handleModeToggle = async (mode: AutomationMode) => {
    if (!homeId || isLoading) return;

    // If trying to deactivate the current mode
    if (mode.active) {
      toast({
        title: "Mode active",
        description:
          "Click another mode to switch, or refresh the page to sync state.",
        variant: "default",
      });
      return;
    }

    // If trying to activate a new mode while another is active
    const activeMode = modes.find((m) => m.active);
    if (activeMode && !mode.active) {
      try {
        setIsLoading(true);
        const success = await toggleAutomationMode(homeId, mode.id);
        if (success) {
          await fetchModes();
          toast({
            title: `Switched to ${mode.name}`,
            description: `Switched from ${activeMode.name} to ${mode.name}`,
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error toggling mode:", error);
        toast({
          title: "Error",
          description: "Failed to switch automation mode. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // If no mode is active, activate the selected mode
    try {
      setIsLoading(true);
      const success = await toggleAutomationMode(homeId, mode.id);
      if (success) {
        await fetchModes();
        toast({
          title: `${mode.name} activated`,
          description: mode.description,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error toggling mode:", error);
      toast({
        title: "Error",
        description: "Failed to activate automation mode. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    modes,
    isLoading,
    handleModeToggle,
  };
}
