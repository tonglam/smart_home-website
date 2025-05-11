"use server";

import { updateUserEmailById } from "@/db/db";
import { revalidatePath } from "next/cache";

interface UpdateUserResult {
  success: boolean;
  error?: string;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function updateUserHomeId(
  userId: string,
  homeId: string
): Promise<UpdateUserResult> {
  try {
    const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

    if (!CLERK_SECRET_KEY) {
      throw new Error("Missing CLERK_SECRET_KEY environment variable");
    }

    const response = await fetch(
      `https://api.clerk.com/v1/users/${userId}/metadata`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_metadata: { homeId },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Clerk API error:", errorData);
      throw new Error(`Failed to update user metadata: ${response.statusText}`);
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    revalidatePath("/api/devices/[homeId]", "page");
    revalidatePath("/api/events/[homeId]", "page");
    revalidatePath("/api/alerts/[homeId]", "page");

    return { success: true };
  } catch (error) {
    console.error("Error updating user home ID:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update user home ID",
    };
  }
}

export async function updateUserEmail(
  userId: string,
  email: string
): Promise<UpdateUserResult> {
  try {
    if (!email || !isValidEmail(email)) {
      return {
        success: false,
        error: "Invalid email format",
      };
    }

    await updateUserEmailById(userId, email);

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Failed to update user email:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update user email",
    };
  }
}
