"use server";

import { db } from "@/db/config"; // Corrected DB instance path
import {
  alertLog,
  userHomes,
  type NewAlertLog,
  type NewUserHome,
} from "@/db/schema"; // Corrected Schema path
import { clerkClient, currentUser } from "@clerk/nextjs/server"; // Clerk auth
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Mock Data Definition ---
const mockHomeId = "00:1A:22:33:44:55"; // Consistent mock home ID

const mockAlertLogData: Omit<NewAlertLog, "homeId" | "userId" | "id">[] = [
  {
    deviceId: "door_q7r8s9t0",
    message: "Connection lost with patio door sensor",
    sentStatus: true,
    dismissed: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
  },
  {
    deviceId: "window_c9d0e1f2",
    message: "Tampering detected - Basement window sensor",
    sentStatus: false,
    dismissed: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    deviceId: "light_e5f6g7h8",
    message: "Home security system: Switching to Away mode",
    sentStatus: true,
    dismissed: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    deviceId: "light_a1b2c3d4",
    message: "Device offline - Living room light not responding",
    sentStatus: false,
    dismissed: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    deviceId: "window_g3h4i5j6",
    message: "Security Warning: Entryway window opened while system armed",
    sentStatus: true,
    dismissed: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    deviceId: "light_i9j0k1l2",
    message: "EMERGENCY: Smoke detected - Emergency lighting activated",
    sentStatus: true,
    dismissed: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    deviceId: "door_m3n4o5p6",
    message: "SECURITY BREACH: Front door forced open - Contacting authorities",
    sentStatus: true,
    dismissed: false,
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
  },
  {
    deviceId: "window_y5z6a7b8",
    message: "Connection lost with dining room window sensor",
    sentStatus: false,
    dismissed: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
  {
    deviceId: "light_i9j0k1l2",
    message: "Night security mode: Pathway light activated",
    sentStatus: true,
    dismissed: false,
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
  },
  {
    deviceId: "light_e5f6g7h8",
    message: "Low battery warning: Kitchen light (15% remaining)",
    sentStatus: true,
    dismissed: false,
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
  },
];

// --- End Mock Data Definition ---

export interface PopulateResult {
  success: boolean;
  message: string;
}

export async function populateMockData(): Promise<PopulateResult> {
  try {
    // Get the full user object using currentUser for server-side access
    const user = await currentUser();

    // Check if user is authenticated
    if (!user) {
      return { success: false, message: "Unauthorized: User not logged in." };
    }

    const userId = user.id; // Get userId directly from user object
    const userEmail = user.primaryEmailAddress?.emailAddress; // Get email safely

    if (!userEmail) {
      // Handle case where email might not be available
      console.warn(
        `Could not retrieve primary email for user ${userId}. Using default.`
      );
      // Consider returning an error if email is strictly required
      // return { success: false, message: "User email not found." };
    }

    // --- Primary Check: Check if a userHome entry already exists for this user ---
    const existingHome = await db
      .select({ homeId: userHomes.homeId })
      .from(userHomes)
      .where(eq(userHomes.userId, userId))
      .limit(1);

    // If a home entry exists, abort the operation.
    if (existingHome.length > 0) {
      console.log(
        `User ${userId} already has a userHomes entry (Home ID: ${existingHome[0].homeId}). Aborting mock data population.`
      );
      return {
        success: false,
        message:
          "Mock data population aborted: User already has associated home data.",
      };
    }

    // --- No existing home found, proceed with mock data population ---
    console.log(`No existing home found for user ${userId}. Proceeding...`);

    // 1. Update Clerk User Metadata with mockHomeId
    try {
      console.log(
        `Updating Clerk metadata for user ${userId} with homeId: ${mockHomeId}`
      );
      // Await the promise returned by clerkClient() to get the instance
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          homeId: mockHomeId, // Set the homeId in public metadata
        },
      });
      console.log(`Successfully updated Clerk metadata for user ${userId}.`);
    } catch (clerkError) {
      console.error(
        `Error updating Clerk metadata for user ${userId}:`,
        clerkError
      );
      return {
        success: false,
        message: `Server Error: Failed to update user profile metadata. ${clerkError instanceof Error ? clerkError.message : "Unknown Clerk API error"}`,
      };
    }

    // 2. Insert User Home into DB
    console.log(`Inserting userHome for user ${userId}...`);
    const userHomeData: NewUserHome = {
      userId,
      homeId: mockHomeId, // Use the mockHomeId constant
      email: userEmail || "default@example.com",
    };
    await db.insert(userHomes).values(userHomeData);
    console.log(`Inserted userHome successfully.`);

    // 3. Insert Alert Log into DB
    const alertLogDataWithUserAndHomeId = mockAlertLogData.map((a) => ({
      ...a,
      homeId: mockHomeId, // Use the mockHomeId constant
      userId,
    })) as NewAlertLog[];
    if (alertLogDataWithUserAndHomeId.length > 0) {
      console.log(
        `Inserting ${alertLogDataWithUserAndHomeId.length} alert log entries...`
      );
      await db.insert(alertLog).values(alertLogDataWithUserAndHomeId);
      console.log(`Inserted alert log entries successfully.`);
    }

    console.log(`Mock data population process completed for user: ${userId}`);

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true, message: "Mock data populated successfully!" };
  } catch (error) {
    console.error("Error during mock data population process:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    // Check for unique constraint violation (likely from primary keys in device/event/alert if the home check passed but others existed)
    if (error instanceof Error && "code" in error && error.code === "23505") {
      return {
        success: false,
        message:
          "Error: A unique data conflict occurred during insertion. Data might be partially inserted.",
      };
    }
    // General error during one of the inserts
    return {
      success: false,
      message: `Server Error: Failed during mock data population. Data might be partially inserted. ${errorMessage}`,
    };
  }
}
