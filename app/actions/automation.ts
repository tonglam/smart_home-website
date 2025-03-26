"use server";

import * as db from "@/lib/db";
import { automationModes } from "@/lib/utils/defaults.util";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export type AutomationMode = {
  id: string;
  name: string;
  icon: string;
  active: boolean;
  description: string;
};

// Cache the getAutomationModes function
export const getAutomationModes = cache(
  async (homeId: string): Promise<AutomationMode[]> => {
    try {
      // Get all lights to determine active mode
      const lights = await db.getDevices(homeId);
      const lightDevices = lights.filter((device) => device.type === "light");

      // Return modes with active state based on lights
      return automationModes.map((mode) => ({
        ...mode,
        active: lightDevices.some((light) => light.mode === mode.id),
      }));
    } catch (error) {
      console.error("Error fetching automation modes:", error);
      // Return modes with no active states in case of error
      return automationModes.map((mode) => ({
        ...mode,
        active: false,
      }));
    }
  }
);

export async function toggleAutomationMode(
  homeId: string,
  modeId: string
): Promise<boolean> {
  try {
    // Get all lights in this home
    const lights = await db.getDevices(homeId);
    const lightDevices = lights.filter((device) => device.type === "light");

    if (lightDevices.length === 0) {
      return false;
    }

    // Get the mode name from the predefined modes
    const targetMode = automationModes.find((m) => m.id === modeId);
    if (!targetMode) {
      throw new Error(`Invalid mode: ${modeId}`);
    }

    // Check if the mode is currently active
    const isCurrentlyActive = lightDevices.every(
      (light) => light.mode === modeId
    );

    // Update each light's mode and log the event
    const updatePromises = lightDevices.map(async (light) => {
      const oldMode = light.mode;

      // If the mode is currently active, set it to undefined, otherwise set it to the target mode
      const newMode = isCurrentlyActive ? undefined : targetMode.id;

      // Update device mode
      await db.updateDevice(light.id, {
        mode: newMode,
      });

      // Log the event
      await db.logEvent({
        home_id: homeId,
        device_id: light.id,
        event_type: "mode_change",
        old_state: oldMode || "none",
        new_state: newMode || "none",
      });
    });

    await Promise.all(updatePromises);

    // Revalidate paths that display automation information
    revalidatePath("/dashboard");
    revalidatePath("/");

    return true;
  } catch (error) {
    console.error("Error toggling automation mode:", error);
    return false;
  }
}
