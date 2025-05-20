"use server";

import { updateHomeMode } from "@/db/db";
import { automationModes } from "@/lib/utils/defaults.util";
import { publishMessage } from "@/lib/utils/mqtt.util";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type AutomationMode = (typeof automationModes)[number];

export async function toggleAutomationMode(
  homeId: string,
  mode: string
): Promise<boolean> {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.error("[Action] User not authenticated");
      return false;
    }

    const result = await updateHomeMode(userId, homeId, mode);

    if (result.success) {
      const topic = "control";
      const message = {
        home_id: homeId,
        type: "automation",
        mode_id: mode,
        active: true,
        created_at: new Date().toISOString(),
      };

      const mqttSuccess = await publishMessage(topic, message);
      if (mqttSuccess) {
        console.log(
          `[Action][MQTT] Successfully published mode change to ${topic}:`,
          message
        );
      } else {
        console.error(
          `[Action][MQTT] Failed to publish mode change to ${topic} for homeId: ${homeId}, mode: ${mode}`
        );
      }
    }

    revalidatePath("/dashboard");

    return result.success;
  } catch (error) {
    console.error("[Action] Error toggling automation mode:", error);
    return false;
  }
}
