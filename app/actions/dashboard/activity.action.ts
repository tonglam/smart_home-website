"use server";

import { markEventAsRead } from "@/db/db";
import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  error?: string;
}

export const markEventReadAction = async (
  eventId: number,
  pathToRevalidate: string = "/"
): Promise<ActionResult> => {
  try {
    await markEventAsRead(eventId);
    revalidatePath(pathToRevalidate);
    return { success: true };
  } catch (err) {
    const error = err as Error;
    console.error("[markEventReadAction] Error:", error.message);
    return { success: false, error: "Failed to mark event as read." };
  }
};
