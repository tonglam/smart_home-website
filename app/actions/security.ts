"use server";

import * as db from "@/lib/db";
import { DbDevice } from "@/lib/types/db.types";

export type SecurityPoint = {
  id: string;
  name: string;
  type: string;
  status: string;
  lastActivity: string;
};

export async function getSecurityPoints(
  homeId: string
): Promise<SecurityPoint[]> {
  try {
    // Get security devices directly from SQL
    const securityDevices = await db.getSecurityDevices(homeId);

    // Get the latest events for these devices to determine their current status
    const securityPoints: SecurityPoint[] = await Promise.all(
      securityDevices.map(async (device: DbDevice) => {
        const events = await db.getDeviceEvents(device.id, 1);
        const latestEvent = events[0];

        return {
          id: device.id,
          name: device.name,
          type: device.type,
          status: latestEvent?.new_state || device.current_state || "unknown",
          lastActivity:
            latestEvent?.created_at ||
            device.last_updated ||
            device.created_at ||
            new Date().toISOString(),
        };
      })
    );

    return securityPoints;
  } catch (error) {
    console.error("[getSecurityPoints] Error fetching security points:", error);
    return [];
  }
}
