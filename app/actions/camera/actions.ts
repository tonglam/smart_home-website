"use server";

import { fetchCameraByHomeId } from "@/db/db";
import type { Device } from "@/db/schema";
import { unstable_noStore as noStore } from "next/cache";

interface CameraStatusResult {
  success: boolean;
  data?: (Device & { status: string | null }) | null;
  error?: string;
  message?: string;
}

export async function getCameraStatusAction(
  homeId: string
): Promise<CameraStatusResult> {
  noStore(); // Opt out of caching for this action

  if (!homeId) {
    return { success: false, error: "Home ID is required." };
  }

  try {
    const cameraDevice = await fetchCameraByHomeId(homeId);

    if (!cameraDevice) {
      return {
        success: false,
        message: "No camera device found for this home.",
      };
    }

    return { success: true, data: cameraDevice };
  } catch (error) {
    console.error("[getCameraStatusAction] Error:", error);
    return {
      success: false,
      error: "Failed to fetch camera status. Please try again.",
    };
  }
}
