"use server";

import * as db from "@/lib/db";
import { DbDevice } from "@/lib/types/db.types";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export interface SecurityPoint {
  id: string;
  name: string;
  type: string;
  status: string;
  lastUpdated: string;
  icon: "door" | "window" | "device";
}

export const getSecurityPoints = cache(
  async (homeId: string): Promise<SecurityPoint[]> => {
    try {
      const securityDevices = await db.getSecurityDevices(homeId);
      return securityDevices.map(deviceToSecurityPoint);
    } catch (error) {
      console.error("Error in getSecurityPoints:", error);
      return [];
    }
  }
);

export async function updateSecurityDeviceStatus(
  deviceId: string,
  newStatus: string
): Promise<boolean> {
  try {
    const result = await db.updateDevice(deviceId, {
      current_state: newStatus,
    });

    if (result.success) {
      // If successful, revalidate any paths that show security data
      revalidatePath("/");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error updating security device status:", error);
    return false;
  }
}

function deviceToSecurityPoint(device: DbDevice): SecurityPoint {
  return {
    id: device.id,
    name: device.name,
    type: device.type,
    status: device.current_state || "unknown",
    lastUpdated:
      device.last_updated || device.created_at || new Date().toISOString(),
    icon: determineIcon(device.type),
  };
}

function determineIcon(type: string): "door" | "window" | "device" {
  if (type.includes("door")) return "door";
  if (type.includes("window")) return "window";
  return "device";
}
