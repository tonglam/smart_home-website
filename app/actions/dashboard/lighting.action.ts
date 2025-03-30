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
  console.log(
    `[Action:Light] Starting updateLightState for device: ${deviceId}`
  );
  const actionStartTime = Date.now();

  try {
    console.time(`[Action:Light] fetchDeviceById ${deviceId}`);
    const currentDevice = await fetchDeviceById(deviceId);
    console.timeEnd(`[Action:Light] fetchDeviceById ${deviceId}`);

    if (!currentDevice) {
      console.error(`[Action:Light] Device with ID ${deviceId} not found.`);
      return false;
    }

    const oldState = currentDevice.currentState;
    const newState = updates.currentState ?? oldState;

    const updatePayload: Partial<Device> = {
      currentState: newState,
      brightness: updates.brightness,
      temperature: updates.temperature,
    };

    // Remove undefined keys to avoid overwriting existing values unintentionally
    Object.keys(updatePayload).forEach(
      (key) =>
        updatePayload[key as keyof typeof updatePayload] === undefined &&
        delete updatePayload[key as keyof typeof updatePayload]
    );

    if (Object.keys(updatePayload).length > 0) {
      // Only update if there are changes
      console.time(`[Action:Light] updateDeviceById ${deviceId}`);
      const updateResult = await updateDeviceById(deviceId, updatePayload);
      console.timeEnd(`[Action:Light] updateDeviceById ${deviceId}`);

      if (!updateResult.success || !updateResult.data) {
        console.error(
          "[Action:Light] Failed to update device:",
          updateResult.error
        );
        return false;
      }
    } else {
      console.log(
        `[Action:Light] No database updates required for device ${deviceId}.`
      );
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
      console.time(`[Action:Light] createEvent ${deviceId}`);
      await createEvent(eventLog);
      console.timeEnd(`[Action:Light] createEvent ${deviceId}`);
    }

    // Construct MQTT payload regardless of DB update success for now
    // Adjust logic if MQTT should only send on successful DB update
    const mqttPayload = {
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
    };

    try {
      console.time(`[Action:Light] publishMessage ${deviceId}`);
      await publishMessage(`device/${deviceId}/control`, mqttPayload);
      console.timeEnd(`[Action:Light] publishMessage ${deviceId}`);
    } catch (mqttError) {
      console.error("[Action:Light] Error publishing MQTT message:", mqttError);
      // Decide if MQTT failure should cause the whole action to fail
      // return false; // Uncomment if MQTT publish is critical
    }

    console.time(`[Action:Light] revalidatePath /dashboard`);
    revalidatePath("/dashboard");
    console.timeEnd(`[Action:Light] revalidatePath /dashboard`);

    const actionEndTime = Date.now();
    console.log(
      `[Action:Light] Finished updateLightState for device: ${deviceId}. Total time: ${actionEndTime - actionStartTime}ms`
    );

    return true;
  } catch (error) {
    console.error("[Action:Light] Error updating light state:", error);
    const actionEndTime = Date.now();
    console.log(
      `[Action:Light] Failed updateLightState for device: ${deviceId}. Total time: ${actionEndTime - actionStartTime}ms`
    );
    return false;
  }
}
