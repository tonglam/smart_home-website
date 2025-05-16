import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { db, client as drizzleClient } from "../db/config";
import { devices, NewDevice } from "../db/schema";

// Load environment variables from .env file
config();

const MOCK_HOME_ID = "00:1A:22:33:44:55"; // Ensure this homeId is what your UI is looking at
const MOCK_FLIPPER_DEVICE_ID = "device-flipper-door-001";

// New configuration for multiple add/update/remove cycles
const TOTAL_LIFECYCLES = 3; // How many times to add, update, and remove the device
const UPDATES_PER_LIFECYCLE = 4; // How many status flips while device exists in a cycle
const PAUSE_AFTER_CREATE_MS = 3000; // Pause after device is created
const PAUSE_BETWEEN_UPDATES_MS = 2500; // Pause between status flips
const PAUSE_AFTER_DELETE_MS = 4000; // Pause after device is deleted, before next cycle

async function ensureMockFlipperDevice(): Promise<void> {
  console.log(
    `Ensuring mock flipper device ${MOCK_FLIPPER_DEVICE_ID} exists...`
  );
  try {
    const existingDevice = await db
      .select()
      .from(devices)
      .where(eq(devices.id, MOCK_FLIPPER_DEVICE_ID))
      .limit(1);

    if (existingDevice.length === 0) {
      console.log(
        `Mock device ${MOCK_FLIPPER_DEVICE_ID} not found, creating it...`
      );
      const newDevice: NewDevice = {
        id: MOCK_FLIPPER_DEVICE_ID,
        homeId: MOCK_HOME_ID,
        name: "Mock Flipper Door Sensor",
        type: "door_sensor", // Important for SecuritySection to pick it up
        currentState: "closed", // Initial state
        location: "Front Door", // Required for device schema
        // CreatedAt and lastUpdated have defaultNow()
      };
      await db.insert(devices).values(newDevice);
      console.log(`Mock device ${MOCK_FLIPPER_DEVICE_ID} created.`);
    } else {
      console.log(
        `Mock device ${MOCK_FLIPPER_DEVICE_ID} already exists. Initial state: ${existingDevice[0].currentState}`
      );
      // Optionally reset its state to 'closed' if needed for consistent test starts
      // await db.update(devices).set({ currentState: "closed", lastUpdated: new Date() }).where(eq(devices.id, MOCK_FLIPPER_DEVICE_ID));
      // console.log(`Mock device ${MOCK_FLIPPER_DEVICE_ID} state reset to 'closed'.`);
    }
  } catch (error) {
    console.error("Error during mock flipper device setup:", error);
    throw error; // Rethrow to stop the script if setup fails
  }
}

async function cycleDevicePresenceAndStatus() {
  console.log(
    `Starting ${TOTAL_LIFECYCLES} lifecycles for device ${MOCK_FLIPPER_DEVICE_ID}. Each with ${UPDATES_PER_LIFECYCLE} updates.`
  );

  for (let cycle = 0; cycle < TOTAL_LIFECYCLES; cycle++) {
    console.log(`\n--- Cycle ${cycle + 1} of ${TOTAL_LIFECYCLES} ---`);

    // 1. Ensure device is created (INSERT)
    console.log(
      `[Cycle ${cycle + 1}] Ensuring device ${MOCK_FLIPPER_DEVICE_ID} is created...`
    );
    // ensureMockFlipperDevice will create it if it doesn't exist, or confirm if it does.
    // To ensure it's a fresh insert for the cycle, we delete it first.
    try {
      console.log(
        `[Cycle ${cycle + 1}] Attempting to delete device ${MOCK_FLIPPER_DEVICE_ID} before ensuring creation...`
      );
      await db.delete(devices).where(eq(devices.id, MOCK_FLIPPER_DEVICE_ID));
      console.log(
        `[Cycle ${cycle + 1}] Device ${MOCK_FLIPPER_DEVICE_ID} deleted (if it existed).`
      );
    } catch (error) {
      console.error(
        `[Cycle ${cycle + 1}] Error deleting device ${MOCK_FLIPPER_DEVICE_ID} pre-cycle:`,
        error
      );
    }
    await ensureMockFlipperDevice(); // This will now perform an INSERT
    console.log(
      `[Cycle ${cycle + 1}] Device ${MOCK_FLIPPER_DEVICE_ID} should now be present. Pausing ${PAUSE_AFTER_CREATE_MS / 1000}s...`
    );
    await new Promise((resolve) => setTimeout(resolve, PAUSE_AFTER_CREATE_MS));

    // 2. Perform status updates (UPDATEs)
    console.log(
      `[Cycle ${cycle + 1}] Performing ${UPDATES_PER_LIFECYCLE} status updates...`
    );
    for (
      let updateCount = 0;
      updateCount < UPDATES_PER_LIFECYCLE;
      updateCount++
    ) {
      try {
        const currentDeviceStateResult = await db
          .select({ currentState: devices.currentState })
          .from(devices)
          .where(eq(devices.id, MOCK_FLIPPER_DEVICE_ID))
          .limit(1);

        if (currentDeviceStateResult.length === 0) {
          console.error(
            `[Cycle ${cycle + 1}] Device ${MOCK_FLIPPER_DEVICE_ID} not found during update attempt ${updateCount + 1}. Skipping further updates in this cycle.`
          );
          break; // Exit update loop for this cycle
        }

        const currentState = currentDeviceStateResult[0].currentState;
        const newState = currentState === "open" ? "closed" : "open";

        console.log(
          `[Cycle ${cycle + 1}] Updating ${MOCK_FLIPPER_DEVICE_ID}: ${currentState} -> ${newState} (Update ${updateCount + 1}/${UPDATES_PER_LIFECYCLE})`
        );
        await db
          .update(devices)
          .set({ currentState: newState, lastUpdated: new Date() })
          .where(eq(devices.id, MOCK_FLIPPER_DEVICE_ID));

        if (updateCount < UPDATES_PER_LIFECYCLE - 1) {
          // Don't pause after the last update before delete
          await new Promise((resolve) =>
            setTimeout(resolve, PAUSE_BETWEEN_UPDATES_MS)
          );
        }
      } catch (error) {
        console.error(
          `[Cycle ${cycle + 1}] Error during update iteration ${updateCount + 1}:`,
          error
        );
        break; // Exit update loop for this cycle on error
      }
    }

    // 3. Delete the device (DELETE)
    console.log(
      `[Cycle ${cycle + 1}] Deleting device ${MOCK_FLIPPER_DEVICE_ID}...`
    );
    try {
      await db.delete(devices).where(eq(devices.id, MOCK_FLIPPER_DEVICE_ID));
      console.log(
        `[Cycle ${cycle + 1}] Device ${MOCK_FLIPPER_DEVICE_ID} deleted.`
      );
    } catch (error) {
      console.error(
        `[Cycle ${cycle + 1}] Error deleting device ${MOCK_FLIPPER_DEVICE_ID} post-cycle:`,
        error
      );
    }

    if (cycle < TOTAL_LIFECYCLES - 1) {
      console.log(
        `[Cycle ${cycle + 1}] End of cycle. Pausing ${PAUSE_AFTER_DELETE_MS / 1000}s before next cycle...`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, PAUSE_AFTER_DELETE_MS)
      );
    }
  }
  console.log("\nAll lifecycles complete.");
}

async function main() {
  try {
    // ensureMockFlipperDevice() // Call once initially if you want to ensure it exists before cycles start, or rely on cycle logic
    await cycleDevicePresenceAndStatus();
  } catch (error) {
    console.error("Flipper script failed:", error);
  } finally {
    if (drizzleClient && typeof drizzleClient.end === "function") {
      console.log("Closing Drizzle database connection...");
      await drizzleClient.end();
      console.log("Drizzle database connection closed.");
    }
    process.exit(0); // Ensure the script exits
  }
}

main();
