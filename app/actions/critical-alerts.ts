"use server";

import { Alert } from "@/components/dashboard/tabs/types";
import * as db from "@/lib/db";
import { DbAlertLog } from "@/lib/types/db.types";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export const getCriticalAlerts = cache(
  async (homeId: string): Promise<Alert[]> => {
    try {
      // Get alerts from D1 for the current day using the proper db function
      const alerts = await db.getAlerts(homeId);

      // Filter for non-dismissed alerts and transform to Alert type
      return alerts
        .filter((alert: DbAlertLog) => alert.dismissed !== 1)
        .map(
          (alert: DbAlertLog): Alert => ({
            id: String(alert.id || 0),
            type: determineAlertType(
              alert.device_name || "",
              alert.device_id || ""
            ),
            message: alert.message,
            timestamp: alert.created_at || new Date().toISOString(),
            deviceId: alert.device_id || "",
            deviceName: alert.device_name || "Unknown Device",
          })
        );
    } catch (error) {
      console.error("Error fetching critical alerts:", error);
      return [];
    }
  }
);

export async function dismissAlert(alertId: string): Promise<boolean> {
  try {
    const result = await db.updateAlertStatus(parseInt(alertId), 1);
    // Revalidate all pages showing alert data
    revalidatePath("/");
    return result.success;
  } catch (error) {
    console.error("Error dismissing alert:", error);
    return false;
  }
}

function determineAlertType(
  deviceName: string,
  deviceId: string
): "warning" | "info" | "error" {
  // For now, we'll use a simple logic based on device name
  if (deviceName.toLowerCase().includes("door")) {
    return "warning";
  }
  if (!deviceId) {
    return "error";
  }
  return "info";
}
