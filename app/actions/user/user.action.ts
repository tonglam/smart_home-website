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

/**
 * Updates the homeId in user's Clerk public metadata
 */
export async function updateUserHomeId(
  userId: string,
  homeId: string
): Promise<UpdateUserResult> {
  try {
    // Get the Clerk API key from environment variables
    const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

    if (!CLERK_SECRET_KEY) {
      throw new Error("Missing CLERK_SECRET_KEY environment variable");
    }

    // Update Clerk public metadata
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

    // Revalidate paths that might depend on this data
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

/**
 * Updates the user's email in Supabase database
 */
export async function updateUserEmail(
  userId: string,
  email: string
): Promise<UpdateUserResult> {
  try {
    // Validate email format
    if (!email || !isValidEmail(email)) {
      return {
        success: false,
        error: "Invalid email format",
      };
    }

    // Update email using the db function
    await updateUserEmailById(userId, email);

    // Revalidate relevant paths
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
