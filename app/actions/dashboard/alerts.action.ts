"use server";

import { dismissAlertById } from "@/db/db";
import { revalidatePath } from "next/cache";

export async function dismissAlert(alertId: string): Promise<boolean> {
  try {
    await dismissAlertById(alertId);

    revalidatePath("/dashboard");
    return true;
  } catch (error) {
    console.error("Failed to dismiss alert:", error);
    return false;
  }
}
