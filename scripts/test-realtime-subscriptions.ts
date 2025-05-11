import {
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { db, client as drizzleClient } from "../db/config"; // Import Drizzle client and db instance
import {
  alertLog,
  devices,
  eventLog,
  NewAlertLog,
  NewEventLog,
} from "../db/schema"; // Import Drizzle schemas and types
import { subscribeToTableChanges, supabase } from "../lib/utils/supabase.util";

// Load environment variables from .env file
config();

const MOCK_HOME_ID = "home-test-123";
const MOCK_USER_ID = "user-test-456";
let MOCK_DEVICE_ID = "device-drizzle-789"; // Changed to avoid potential collision with previous script runs

async function setupMockDevice(): Promise<void> {
  console.log("Checking for mock device using Drizzle...");
  try {
    const existingDevice = await db
      .select()
      .from(devices)
      .where(eq(devices.id, MOCK_DEVICE_ID))
      .limit(1);

    if (existingDevice.length === 0) {
      console.log(
        `Mock device ${MOCK_DEVICE_ID} not found, creating it with Drizzle...`
      );
      await db.insert(devices).values({
        id: MOCK_DEVICE_ID,
        homeId: MOCK_HOME_ID,
        name: "Mock Drizzle Test Device",
        type: "sensor",
        currentState: "idle",
        // createdAt and lastUpdated have defaultNow(), so not explicitly set here
      });
      console.log(`Mock device ${MOCK_DEVICE_ID} created with Drizzle.`);
    } else {
      console.log(`Mock device ${MOCK_DEVICE_ID} already exists.`);
    }
  } catch (error) {
    console.error("Error during Drizzle mock device setup:", error);
    console.warn(
      "Proceeding with test, but FK constraints for event_log/alert_log might cause issues if device setup failed."
    );
  }
}

// Define simple interfaces for the expected .new payload for type assertion
interface AlertLogPayloadNew {
  message?: string;
  // Add other expected fields from alert_log if necessary for checks
}

interface EventLogPayloadNew {
  newState?: string;
  oldState?: string;
  // Add other expected fields from event_log if necessary for checks
}

async function testRealtimeSubscriptions() {
  console.log("Starting Realtime subscription test with Drizzle for DML...");

  await setupMockDevice();

  let alertLogSubscription: RealtimeChannel | null = null;
  let eventLogSubscription: RealtimeChannel | null = null;

  try {
    // 1. Subscribe to ALL events on alert_log, then filter for INSERT in callback
    console.log(
      `Subscribing (via '*' filter) to events on alert_log for home_id: ${MOCK_HOME_ID}, intending to catch INSERTs`
    );
    alertLogSubscription = subscribeToTableChanges<any>(
      `db-alert_log-changes-${MOCK_HOME_ID}`,
      REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT, // Still pass intended event for logging in util
      "public",
      "alert_log",
      (payload: RealtimePostgresChangesPayload<any>) => {
        console.log(
          "\n--- ALERT_LOG RAW EVENT RECEIVED (Subscribed via '*' filter) ---"
        );
        console.dir(payload, { depth: null });
        if (
          payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT
        ) {
          console.log(">>> Matched desired INSERT event on alert_log! <<<");
          const newRecord = payload.new as AlertLogPayloadNew; // Type assertion
          if (
            newRecord &&
            newRecord.message === "Test alert message via Drizzle!"
          ) {
            console.log(
              "SUCCESS: Correct test alert_log Drizzle insert data received!"
            );
          } else {
            console.warn(
              "WARNING: Received an INSERT on alert_log, but new data content mismatch or missing."
            );
          }
        } else {
          console.log(
            `(Ignoring event type ${payload.eventType} on alert_log subscription)`
          );
        }
        console.log(
          "----------------------------------------------------------------\n"
        );
      }
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 2. Subscribe to ALL events on event_log, then filter for INSERT and UPDATE in callback
    console.log(
      `Subscribing (via '*' filter) to events on event_log for home_id: ${MOCK_HOME_ID}, intending to catch INSERTs and UPDATEs`
    );
    eventLogSubscription = subscribeToTableChanges<any>(
      `db-event_log-changes-${MOCK_HOME_ID}`,
      [
        REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
        REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE,
      ], // Listen to both INSERT and UPDATE
      "public",
      "event_log",
      (payload: RealtimePostgresChangesPayload<any>) => {
        console.log(
          "\n--- EVENT_LOG RAW EVENT RECEIVED (Subscribed via '*' filter) ---"
        );
        console.dir(payload, { depth: null });

        if (
          payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT
        ) {
          console.log(">>> Matched desired INSERT event on event_log! <<<");
          const newRecord = payload.new as EventLogPayloadNew;
          // Example check for the initially inserted event_log record
          if (
            newRecord &&
            newRecord.newState === "active-initial-drizzle" &&
            newRecord.oldState === "idle-drizzle"
          ) {
            console.log(
              "SUCCESS: Correct test event_log Drizzle INSERT data received!"
            );
          } else {
            console.warn(
              "WARNING: Received an INSERT on event_log, but new data content mismatch or missing.",
              "Expected newState: active-initial-drizzle, oldState: idle-drizzle. Received:",
              newRecord
            );
          }
        } else if (
          payload.eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE
        ) {
          console.log(">>> Matched desired UPDATE event on event_log! <<<");
          const newRecord = payload.new as EventLogPayloadNew;
          // Check for the updated event_log record
          if (newRecord && newRecord.newState === "active-updated-drizzle") {
            console.log(
              "SUCCESS: Correct test event_log Drizzle UPDATE data received!"
            );
          } else {
            console.warn(
              "WARNING: Received an UPDATE on event_log, but new data content mismatch or missing.",
              "Expected newState: active-updated-drizzle. Received:",
              newRecord
            );
          }
        } else {
          console.log(
            `(Ignoring event type ${payload.eventType} on event_log subscription)`
          );
        }
        console.log(
          "---------------------------------------------------------------\n"
        );
      }
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 3. Trigger alert_log INSERT using Drizzle
    console.log("\nInserting a record into alert_log using Drizzle...");
    try {
      const newAlert: NewAlertLog = {
        homeId: MOCK_HOME_ID,
        userId: MOCK_USER_ID,
        deviceId: MOCK_DEVICE_ID,
        message: "Test alert message via Drizzle!",
        // sentStatus and dismissed have defaults
      };
      await db.insert(alertLog).values(newAlert);
      console.log(
        "Record inserted into alert_log via Drizzle. Check for Realtime message above ^^"
      );
    } catch (dbError) {
      console.error("Error inserting into alert_log with Drizzle:", dbError);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 4. Trigger event_log UPDATE using Drizzle
    console.log(
      "\nInserting a record into event_log using Drizzle to prepare for update..."
    );
    try {
      const newEventToInsert: NewEventLog = {
        homeId: MOCK_HOME_ID,
        deviceId: MOCK_DEVICE_ID,
        eventType: "test_event_drizzle",
        oldState: "idle-drizzle",
        newState: "active-initial-drizzle",
        // read has default
      };
      const insertedEvent = await db
        .insert(eventLog)
        .values(newEventToInsert)
        .returning({ id: eventLog.id });

      if (!insertedEvent || insertedEvent.length === 0) {
        console.error(
          "Failed to insert into event_log with Drizzle or did not get ID back."
        );
      } else {
        const eventLogIdToUpdate = insertedEvent[0].id;
        console.log(
          `Record inserted into event_log with Drizzle, id: ${eventLogIdToUpdate}. Now updating it...`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await db
          .update(eventLog)
          .set({ newState: "active-updated-drizzle", read: true })
          .where(eq(eventLog.id, eventLogIdToUpdate));
        console.log(
          "Record updated in event_log via Drizzle. Check for Realtime message above ^^"
        );
      }
    } catch (dbError) {
      console.error(
        "Error during event_log insert/update with Drizzle:",
        dbError
      );
    }

    console.log(
      "\nTest actions complete. Waiting a few seconds for any remaining Realtime events..."
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (error) {
    console.error("An unexpected error occurred during the test:", error);
  } finally {
    console.log("\nCleaning up subscriptions...");
    if (alertLogSubscription) {
      await supabase.removeChannel(alertLogSubscription);
      console.log("Alert_log subscription removed.");
    }
    if (eventLogSubscription) {
      await supabase.removeChannel(eventLogSubscription);
      console.log("Event_log subscription removed.");
    }
    console.log("Test script finished.");
    // Explicitly close the Drizzle/postgres.js connection using the imported client
    if (drizzleClient && typeof drizzleClient.end === "function") {
      console.log("Closing Drizzle database connection...");
      await drizzleClient.end();
      console.log("Drizzle database connection closed.");
    }
  }
}

testRealtimeSubscriptions().catch(async (err) => {
  console.error("Failed to run test script:", err);
  // Ensure connection is closed even on top-level catch
  if (drizzleClient && typeof drizzleClient.end === "function") {
    console.log("Closing Drizzle database connection due to error...");
    await drizzleClient
      .end()
      .catch((closeErr: any) =>
        console.error(
          "Error closing Drizzle connection on script failure:",
          closeErr
        )
      );
  }
});
