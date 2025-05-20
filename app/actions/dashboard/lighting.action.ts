"use server";

import { createEvent, fetchDeviceById, updateDeviceById } from "@/db/db";
import { Device, EventLog } from "@/db/schema";
import { publishMessage } from "@/lib/utils/mqtt.util";
import { revalidatePath } from "next/cache";

type LightUpdatePayload = Partial<Pick<Device, "currentState" | "brightness">>;

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

    let newBrightness =
      updates.brightness !== undefined
        ? updates.brightness
        : (currentDevice.brightness ?? 0);

    let newDbState = updates.currentState;

    if (updates.brightness !== undefined && updates.brightness !== null) {
      if (updates.brightness > 0) {
        newDbState = "on";
      } else {
        newDbState = "off";
      }
    } else if (newDbState === undefined) {
      newDbState = currentDevice.currentState;
    }

    if (newDbState === "off") {
      newBrightness = 0;
    } else if (newDbState === "on" && newBrightness === 0) {
      newBrightness = 100;
    }

    const oldDbState = currentDevice.currentState;
    const oldDbBrightness = currentDevice.brightness ?? 0;

    const updatePayloadForDb: Partial<Device> = {};

    if (newDbState !== oldDbState) {
      updatePayloadForDb.currentState = newDbState;
    }

    if (newBrightness !== null && newBrightness !== oldDbBrightness) {
      updatePayloadForDb.brightness = newBrightness;
    }

    if (Object.keys(updatePayloadForDb).length > 0) {
      const updateResult = await updateDeviceById(deviceId, updatePayloadForDb);
      if (!updateResult.success || !updateResult.data) {
        console.error("Failed to update device:", updateResult.error);
        return false;
      }
    }

    if (newDbState !== oldDbState) {
      const eventLog: Omit<EventLog, "id" | "createdAt"> = {
        deviceId,
        homeId,
        eventType: "state_change",
        oldState: oldDbState ?? "unknown",
        newState: newDbState!,
        read: false,
      };
      await createEvent(eventLog);
    }

    const mqttPayload = {
      homeId: homeId,
      type: "light",
      deviceId: deviceId,
      state: newDbState!,
      brightness: newBrightness!,
      createdAt: new Date().toISOString(),
    };

    try {
      const published = await publishMessage("control", mqttPayload);
      if (!published) {
        console.error("Failed to publish MQTT message for light update.");
      }
    } catch (mqttError) {
      console.error("Error publishing MQTT message:", mqttError);
    }

    revalidatePath("/dashboard");

    return true;
  } catch (error) {
    console.error("Error updating light state:", error);
    return false;
  }
}
