"use server";

import * as db from "@/lib/db";
import { ApiEventLog, DbEventLog } from "@/lib/types/db.types";
import { revalidatePath } from "next/cache";
import { cache } from "react";

class EventOperationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = "EventOperationError";
  }
}

function transformEventToApi(event: DbEventLog): ApiEventLog {
  return {
    ...event,
    created_at: event.created_at || new Date().toISOString(),
  };
}

export const getRecentEvents = cache(
  async (homeId: string, limit = 50): Promise<ApiEventLog[]> => {
    try {
      const events = await db.getEvents(homeId, limit);
      return events.map(transformEventToApi);
    } catch (error) {
      console.error("Failed to fetch recent events:", error);
      throw new EventOperationError(
        "Unable to fetch events. Please try again later.",
        "FETCH_ERROR"
      );
    }
  }
);

export const getDeviceEvents = cache(
  async (
    homeId: string,
    deviceId: string,
    limit = 20
  ): Promise<ApiEventLog[]> => {
    try {
      // First verify the device belongs to the home
      const device = await db.getDeviceById(deviceId);
      if (!device || device.home_id !== homeId) {
        throw new EventOperationError(
          "Device not found or unauthorized",
          "NOT_FOUND"
        );
      }

      const events = await db.getDeviceEvents(deviceId, limit);
      return events.map(transformEventToApi);
    } catch (error) {
      console.error("Failed to fetch device events:", error);
      if (error instanceof EventOperationError) {
        throw error;
      }
      throw new EventOperationError(
        "Failed to fetch device events. Please try again later.",
        "FETCH_ERROR"
      );
    }
  }
);

export async function logDeviceEvent(
  homeId: string,
  deviceId: string,
  eventType: string,
  oldState?: string,
  newState?: string
): Promise<ApiEventLog> {
  try {
    // Verify device belongs to home
    const device = await db.getDeviceById(deviceId);
    if (!device || device.home_id !== homeId) {
      throw new EventOperationError("Invalid device", "INVALID_DEVICE");
    }

    const result = await db.logEvent({
      home_id: homeId,
      device_id: deviceId,
      event_type: eventType,
      old_state: oldState,
      new_state: newState,
    });

    if (!result.success) {
      throw new Error("Failed to log event");
    }

    const events = await db.getEvents(homeId, 1);
    const createdEvent = events[0];

    if (!createdEvent) {
      throw new Error("Failed to fetch created event");
    }

    revalidatePath("/events");
    return transformEventToApi(createdEvent);
  } catch (error) {
    console.error("Failed to log device event:", error);
    if (error instanceof EventOperationError) {
      throw error;
    }
    throw new EventOperationError(
      "Failed to log event. Please try again later.",
      "LOG_ERROR"
    );
  }
}
