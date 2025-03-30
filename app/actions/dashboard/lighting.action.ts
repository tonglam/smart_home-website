"use server";

import { createEvent, fetchDeviceById, updateDeviceById } from "@/db/db";
import { Device, EventLog } from "@/db/schema";
import { publishMessage } from "@/lib/utils/mqtt.util";
import { revalidatePath } from "next/cache";

// Define the type for light-specific updates more accurately
type LightUpdatePayload = Partial<
  Pick<Device, "currentState" | "brightness" | "temperature">
>;

export async function updateLightState(
  deviceId: string,
  homeId: string,
  updates: LightUpdatePayload
): Promise<boolean> {
  try {
    const currentDevice = await fetchDeviceById(deviceId);
    if (!currentDevice) {
      console.error(`Device with ID ${deviceId} not found.`);
      return false;
    }

    const oldState = currentDevice.currentState;
    const newState = updates.currentState ?? oldState;

    const updatePayload: Partial<Device> = {
      currentState: newState,
      brightness: updates.brightness,
      temperature: updates.temperature,
    };

    Object.keys(updatePayload).forEach(
      (key) =>
        updatePayload[key as keyof typeof updatePayload] === undefined &&
        delete updatePayload[key as keyof typeof updatePayload]
    );

    const updateResult = await updateDeviceById(deviceId, updatePayload);

    if (!updateResult.success || !updateResult.data) {
      console.error("Failed to update device:", updateResult.error);
      return false;
    }

    if (oldState !== newState) {
      const eventLog: Omit<EventLog, "id" | "createdAt"> = {
        deviceId,
        homeId,
        eventType: "state_change",
        oldState: oldState,
        newState: newState,
        read: false,
      };
      await createEvent(eventLog);
    }

    const payload = {
      homeId: homeId,
      type: "light",
      deviceId: deviceId,
      state: newState,
      ...(updates.brightness !== undefined && {
        brightness: updates.brightness,
      }),
      ...(updates.temperature !== undefined && {
        temperature: updates.temperature,
      }),
      createdAt: new Date().toISOString(),
    };

    try {
      const published = await publishMessage("control", payload);
      if (!published) {
        console.error("Failed to publish MQTT message for light update.");
      }
    } catch (mqttError) {
      console.error("Error publishing MQTT message:", mqttError);
    }

    // 5. Revalidate the dashboard page
    revalidatePath("/dashboard");

    return true;
  } catch (error) {
    console.error("Error updating light state:", error);
    return false;
  }
}
