"use server";

import * as db from "@/lib/db";
import { revalidatePath } from "next/cache";

class AlertOperationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = "AlertOperationError";
  }
}

export async function updateAlertSentStatus(
  homeId: string,
  alertId: number,
  status: number
): Promise<void> {
  try {
    // First verify the alert belongs to the home
    const alerts = await db.getAlerts(homeId);
    const alert = alerts.find((a) => a.id === alertId);

    if (!alert) {
      throw new AlertOperationError(
        "Alert not found or unauthorized",
        "NOT_FOUND"
      );
    }

    const result = await db.updateAlertStatus(alertId, status);

    if (!result.success) {
      throw new Error("Failed to update alert status");
    }

    revalidatePath("/alerts");
  } catch (error) {
    console.error("Failed to update alert status:", error);
    if (error instanceof AlertOperationError) {
      throw error;
    }
    throw new AlertOperationError(
      "Failed to update alert status. Please try again later.",
      "UPDATE_ERROR"
    );
  }
}
