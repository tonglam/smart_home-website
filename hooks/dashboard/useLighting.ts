/**
 * Hook for managing smart home lighting devices
 * Handles state changes, brightness control, and optimistic updates
 */
"use client";

import { updateLightState } from "@/app/actions/dashboard/lighting.action";
import type { Light } from "@/types";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

/**
 * Helper function to remove a device from pending updates after a delay
 * Used to prevent rapid state changes and provide visual feedback
 */
const removePendingUpdateWithDelay = (
  setPendingUpdates: React.Dispatch<React.SetStateAction<Set<string>>>,
  id: string,
  delayMs: number = 2000
) => {
  setTimeout(() => {
    setPendingUpdates((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, delayMs);
};

export function useLighting(homeId: string, initialLights: Light[] = []) {
  const [lights, setLights] = useState<Light[]>(initialLights);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  /**
   * Toggles a light's on/off state with optimistic updates
   * Reverts changes on failure and manages pending state
   */
  const toggleLight = async (id: string) => {
    const light = lights.find((l) => l.id === id);
    if (!light) {
      toast.error("Light device not found");
      return;
    }

    if (pendingUpdates.has(id)) {
      return;
    }

    try {
      setPendingUpdates((prev) => new Set(prev).add(id));

      // Optimistic update
      setLights(lights.map((l) => (l.id === id ? { ...l, isOn: !l.isOn } : l)));

      const success = await updateLightState(id, homeId, {
        currentState: light.isOn ? "off" : "on",
      });

      if (!success) {
        // Revert optimistic update
        setLights(
          lights.map((l) => (l.id === id ? { ...l, isOn: light.isOn } : l))
        );
        toast.error("Failed to update light state");

        setPendingUpdates((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        toast.success(`${light.name} toggled successfully.`);
        removePendingUpdateWithDelay(setPendingUpdates, id);
      }
    } catch (error) {
      // Revert optimistic update on error
      setLights(
        lights.map((l) => (l.id === id ? { ...l, isOn: light.isOn } : l))
      );
      toast.error("Error updating light state");

      setPendingUpdates((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      console.error("Toggle light error:", error);
    }
  };

  /**
   * Adjusts a light's brightness with optimistic updates
   * Handles both brightness and on/off state changes
   */
  const adjustBrightness = useCallback(
    async (id: string, value: number) => {
      const light = lights.find((l) => l.id === id);
      if (!light) {
        toast.error("Light device not found");
        return;
      }

      const newBrightness = Math.max(0, Math.min(100, Math.round(value)));
      const newIsOn = newBrightness > 0;

      if (light.brightness === newBrightness || pendingUpdates.has(id)) {
        return;
      }

      const originalBrightness = light.brightness;
      const originalIsOn = light.isOn;

      try {
        setPendingUpdates((prev) => new Set(prev).add(id));

        // Optimistic update
        setLights(
          lights.map((l) =>
            l.id === id ? { ...l, brightness: newBrightness, isOn: newIsOn } : l
          )
        );

        const success = await updateLightState(id, homeId, {
          brightness: newBrightness,
          ...(newIsOn !== originalIsOn && {
            currentState: newIsOn ? "on" : "off",
          }),
        });

        if (!success) {
          // Revert optimistic update
          setLights(
            lights.map((l) =>
              l.id === id
                ? { ...l, brightness: originalBrightness, isOn: originalIsOn }
                : l
            )
          );
          toast.error(`Failed to update brightness for ${light.name}`);

          setPendingUpdates((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        } else {
          toast.success(`Brightness updated for ${light.name}`);
          removePendingUpdateWithDelay(setPendingUpdates, id);
        }
      } catch (error) {
        // Revert optimistic update on error
        setLights(
          lights.map((l) =>
            l.id === id
              ? { ...l, brightness: originalBrightness, isOn: originalIsOn }
              : l
          )
        );
        toast.error(`Error updating brightness for ${light.name}`);

        setPendingUpdates((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        console.error("Adjust brightness error:", error);
      }
    },
    [homeId, lights, pendingUpdates]
  );

  const pendingUpdatesArray = useMemo(
    () => Array.from(pendingUpdates),
    [pendingUpdates]
  );

  return {
    lights,
    toggleLight,
    adjustBrightness,
    pendingUpdates: pendingUpdatesArray,
  };
}
