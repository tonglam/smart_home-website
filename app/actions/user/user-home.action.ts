"use server";

import { createOrUpdateUserHomeConnection, updateUserEmailById } from "@/db/db";
import { revalidatePath } from "next/cache";

export async function ensureUserHomeConnection(
  userId: string,
  homeId: string,
  email: string
): Promise<void> {
  try {
    await createOrUpdateUserHomeConnection(userId, homeId, email);

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error ensuring user-home connection:", error);
    throw new Error("Failed to establish user-home connection");
  }
}

export async function updateUserEmail(
  userId: string,
  email: string
): Promise<boolean> {
  try {
    await updateUserEmailById(userId, email);
    return true;
  } catch (error) {
    console.error("Error updating user email:", error);
    return false;
  }
}
