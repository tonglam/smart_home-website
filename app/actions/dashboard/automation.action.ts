"use server";

import { fetchDevicesByHomeId, updateDeviceById } from "@/db/db";
import { publishMessage } from "@/lib/utils/mqtt.util";
import { revalidatePath } from "next/cache";

export interface AutomationMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
}

export async function toggleAutomationMode(
  homeId: string,
  modeId: string | null
): Promise<boolean> {
  try {
    // Get all devices in the home
    const devices = await fetchDevicesByHomeId(homeId);

    const homeLightDevices = devices.filter(
      (device) => device.type === "light"
    );

    if (homeLightDevices.length === 0) {
      console.log("No light devices found in this home, skipping mode update.");
      return true;
    }

    // Determine the mode to set (null for deactivation)
    const newModeValue = modeId;
    const isActive = modeId !== null;

    // Update each light device's mode
    const updatePromises = homeLightDevices.map((device) =>
      updateDeviceById(device.id, {
        mode: newModeValue,
      })
    );

    const results = await Promise.allSettled(updatePromises);
    const failedUpdates = results.filter(
      (result) => result.status === "rejected"
    );

    if (failedUpdates.length > 0) {
      console.error(
        "Failed updates during automation toggle:",
        failedUpdates.map((f) => (f as PromiseRejectedResult).reason)
      );
      throw new Error(
        `Failed to update mode for ${failedUpdates.length} devices`
      );
    }

    // Publish MQTT message indicating mode change
    const payload = {
      homeId: homeId,
      type: "automation",
      modeId: newModeValue,
      active: isActive,
      createdAt: new Date().toISOString(),
    };
    try {
      const published = await publishMessage("control", payload);
      if (!published) {
        console.error("Failed to publish MQTT message for automation update.");
      }
    } catch (mqttError) {
      console.error("Error publishing MQTT message for automation:", mqttError);
    }

    // Revalidate the dashboard path to reflect changes
    revalidatePath(`/dashboard/${homeId}`);
    return true;
  } catch (error) {
    console.error("Failed to toggle automation mode:", error);
    return false;
  }
}
