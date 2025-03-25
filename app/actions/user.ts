"use server";

import { revalidatePath } from "next/cache";

/**
 * Updates the homeId in a user's public metadata
 */
export async function updateUserHomeId(userId: string, homeId: string) {
  try {
    // Get the Clerk API key from environment variables
    const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

    if (!CLERK_SECRET_KEY) {
      throw new Error("Missing CLERK_SECRET_KEY environment variable");
    }

    // Make the API request directly with proper typing
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

    return { success: true };
  } catch (error) {
    console.error("Error updating user metadata:", error);
    return { success: false, error };
  }
}
