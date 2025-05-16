"use server";

import { updateHomeMode } from "@/db/db";
import { automationModes } from "@/lib/utils/defaults.util";

export type AutomationMode = (typeof automationModes)[number];

export async function toggleAutomationMode(
  homeId: string,
  userId: string,
  mode: string
): Promise<boolean> {
  try {
    const result = await updateHomeMode(userId, homeId, mode);
    return result.success;
  } catch (error) {
    console.error("Error toggling automation mode:", error);
    return false;
  }
}
