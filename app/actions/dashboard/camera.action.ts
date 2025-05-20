"use server";

import { createEvent, fetchDeviceById, updateDeviceById } from "@/db/db";
import { Device, EventLog } from "@/db/schema";
import { publishMessage } from "@/lib/utils/mqtt.util";
import { revalidatePath } from "next/cache";

interface CameraUpdatePayloadAction {
  currentState: "online" | "offline";
}

export async function updateCameraState(
  deviceId: string,
  homeId: string,
  updates: CameraUpdatePayloadAction
): Promise<boolean> {
  try {
    const currentDevice = await fetchDeviceById(deviceId);
    if (!currentDevice) {
      console.error(`Device with ID ${deviceId} (camera) not found.`);
      return false;
    }

    const oldDbState = currentDevice.currentState as
      | "online"
      | "offline"
      | undefined
      | null;
    const newDesiredStatus = updates.currentState;

    if (newDesiredStatus === undefined) {
      console.error("No new state provided for camera update.");
      return false;
    }

    const newDbState = newDesiredStatus;

    if (oldDbState === newDbState) {
      console.log(
        `Camera ${deviceId} is already ${newDbState}. MQTT will be published.`
      );
    }

    const updatePayloadForDb: Partial<Device> = {
      currentState: newDbState,
    };

    const updateResult = await updateDeviceById(deviceId, updatePayloadForDb);

    if (!updateResult.success || !updateResult.data) {
      console.error("Failed to update camera device:", updateResult.error);
      return false;
    }

    if (oldDbState !== newDbState) {
      const eventLog: Omit<EventLog, "id" | "createdAt"> = {
        deviceId,
        homeId,
        eventType: "state_change",
        oldState: oldDbState ?? "offline",
        newState: newDbState,
        read: false,
      };
      await createEvent(eventLog);
    }

    const mqttPayload = {
      homeId: homeId,
      type: "camera",
      deviceId: deviceId,
      state: newDesiredStatus,
      createdAt: new Date().toISOString(),
    };

    try {
      const published = await publishMessage("control", mqttPayload);
      if (!published) {
        console.error("Failed to publish MQTT message for camera update.");
      }
    } catch (mqttError) {
      console.error("Error publishing MQTT message for camera:", mqttError);
    }

    revalidatePath("/dashboard");

    return true;
  } catch (error) {
    console.error("Error updating camera state:", error);
    return false;
  }
}
