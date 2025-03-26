"use server";

import * as db from "@/lib/db";
import { ApiDevice, DbDevice } from "@/lib/types/db.types";
import { revalidatePath } from "next/cache";
import { cache } from "react";

// Error class for device operations
class DeviceOperationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = "DeviceOperationError";
  }
}

// Transform DB device to API device
function transformDeviceToApi(device: DbDevice): ApiDevice {
  return {
    ...device,
    created_at: device.created_at || new Date().toISOString(),
    last_updated: device.last_updated || new Date().toISOString(),
  };
}

export const getDevicesByType = cache(
  async (homeId: string, type: string): Promise<ApiDevice[]> => {
    try {
      const devices = await db.getDevices(homeId);
      const filteredDevices = devices.filter((device) => device.type === type);
      return filteredDevices.map(transformDeviceToApi);
    } catch (error) {
      console.error("Failed to fetch devices by type:", error);
      throw new DeviceOperationError(
        "Unable to fetch devices. Please try again later.",
        "FETCH_ERROR"
      );
    }
  }
);

export async function updateDeviceState(
  deviceId: string,
  newState: string,
  homeId: string
): Promise<ApiDevice> {
  try {
    const device = await db.getDeviceById(deviceId);

    if (!device) {
      throw new DeviceOperationError("Device not found", "NOT_FOUND");
    }

    if (device.home_id !== homeId) {
      throw new DeviceOperationError("Unauthorized access", "UNAUTHORIZED");
    }

    const oldState = device.current_state;

    const result = await db.updateDevice(deviceId, { current_state: newState });
    if (!result.success) {
      throw new Error("Failed to update device state");
    }

    // Log the state change event
    await db.logEvent({
      home_id: homeId,
      device_id: deviceId,
      event_type: "STATE_CHANGE",
      old_state: oldState,
      new_state: newState,
    });

    const updatedDevice = await db.getDeviceById(deviceId);
    if (!updatedDevice) {
      throw new Error("Failed to fetch updated device");
    }

    revalidatePath("/devices");
    return transformDeviceToApi(updatedDevice);
  } catch (error) {
    console.error("Failed to update device state:", error);
    if (error instanceof DeviceOperationError) {
      throw error;
    }
    throw new DeviceOperationError(
      "Failed to update device state. Please try again later.",
      "UPDATE_ERROR"
    );
  }
}
