import { db } from "@/db/config";
import {
  alertLog,
  devices,
  eventLog,
  userHomes,
  type AlertLog,
  type Device,
  type EventLog,
  type NewEventLog,
} from "@/db/schema";
import { and, desc, eq, gte } from "drizzle-orm";

export async function testDatabaseConnection() {
  try {
    await db.select().from(devices).limit(1);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

export const fetchDevicesByHomeId = async (
  homeId: string
): Promise<Device[]> => {
  try {
    const data = await db
      .select()
      .from(devices)
      .where(eq(devices.homeId, homeId));

    return data;
  } catch (err) {
    const error = err as Error;
    console.error("[fetchDevicesByHomeId] Error:", error);
    throw error;
  }
};

export const fetchDeviceById = async (
  deviceId: string
): Promise<Device | null> => {
  try {
    const [data] = await db
      .select()
      .from(devices)
      .where(eq(devices.id, deviceId))
      .limit(1);

    return data || null;
  } catch (err) {
    const error = err as Error;
    console.error("[fetchDeviceById] Error:", error);
    throw error;
  }
};

export const updateDeviceById = async (
  deviceId: string,
  updates: Partial<Omit<Device, "id" | "homeId" | "type" | "createdAt">>
) => {
  try {
    const [data] = await db
      .update(devices)
      .set({
        currentState: updates.currentState,
        lastUpdated: new Date(),
        mode: updates.mode,
        brightness: updates.brightness,
        temperature: updates.temperature,
      })
      .where(eq(devices.id, deviceId))
      .returning();

    if (!data) {
      return { success: false, error: "Failed to update device" };
    }

    return { success: true, data };
  } catch (err) {
    const error = err as Error;
    console.error("[updateDeviceById] Error:", error);
    return { success: false, error: error.message };
  }
};

// Event operations
export const fetchEventsByDeviceId = async (
  deviceId: string
): Promise<EventLog[]> => {
  try {
    const data = await db
      .select()
      .from(eventLog)
      .where(eq(eventLog.deviceId, deviceId))
      .orderBy(desc(eventLog.createdAt));

    return data;
  } catch (err) {
    const error = err as Error;
    console.error("[fetchEventsByDeviceId] Error:", error);
    throw error;
  }
};

export const createEvent = async (event: NewEventLog) => {
  try {
    const [data] = await db
      .insert(eventLog)
      .values({
        homeId: event.homeId,
        deviceId: event.deviceId,
        eventType: event.eventType,
        oldState: event.oldState,
        newState: event.newState,
        createdAt: new Date(),
      })
      .returning();

    return { success: true, data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
};

export const fetchAlertsByHomeId = async (
  homeId: string
): Promise<AlertLog[]> => {
  try {
    const data = await db
      .select()
      .from(alertLog)
      .where(and(eq(alertLog.homeId, homeId), eq(alertLog.dismissed, false)))
      .orderBy(desc(alertLog.createdAt));

    return data;
  } catch (err) {
    const error = err as Error;
    console.error("Error getting alerts:", error);
    throw error;
  }
};

export const dismissAlertById = async (alertId: string): Promise<void> => {
  try {
    await db
      .update(alertLog)
      .set({ dismissed: true })
      .where(eq(alertLog.id, parseInt(alertId, 10)));
  } catch (err) {
    const error = err as Error;
    throw error;
  }
};

export const fetchSecurityDevicesByHomeId = async (homeId: string) => {
  try {
    const data = await db
      .select()
      .from(devices)
      .where(and(eq(devices.type, "door_sensor"), eq(devices.homeId, homeId)));

    return { success: true, data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
};

// Helper functions
export const hasDeviceAccess = async (
  deviceId: string,
  homeId: string
): Promise<boolean> => {
  const response = await fetchDeviceById(deviceId);
  if (!response || response.homeId !== homeId) return false;
  return true;
};

export const fetchDeviceAndEventsByDeviceId = async (
  deviceId: string
): Promise<{ device: Device; events: EventLog[] }> => {
  try {
    const deviceResponse = await fetchDeviceById(deviceId);
    if (!deviceResponse) {
      throw new Error("Failed to fetch device");
    }

    const eventsResponse = await fetchEventsByDeviceId(deviceId);
    if (!eventsResponse) {
      throw new Error("Failed to fetch events");
    }

    return {
      device: deviceResponse,
      events: eventsResponse,
    };
  } catch (err) {
    const error = err as Error;
    console.error("[fetchDeviceAndEventsByDeviceId] Error:", error);
    throw error;
  }
};

export const fetchRecentHomeEvents = async (
  homeId: string
): Promise<EventLog[]> => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const data = await db
      .select()
      .from(eventLog)
      .where(
        and(
          eq(eventLog.homeId, homeId),
          eq(eventLog.read, false),
          gte(eventLog.createdAt, oneDayAgo)
        )
      )
      .orderBy(desc(eventLog.createdAt));

    return data;
  } catch (err) {
    const error = err as Error;
    console.error("[fetchRecentHomeEvents] Error:", error);
    throw error;
  }
};

export const updateUserEmailById = async (
  userId: string,
  email: string
): Promise<{ email: string }> => {
  try {
    const [data] = await db
      .update(userHomes)
      .set({ email })
      .where(eq(userHomes.userId, userId))
      .returning();

    if (!data) throw new Error("User not found");

    return { email: data.email };
  } catch (err) {
    const error = err as Error;
    throw error;
  }
};

export const hasUserHomeAccess = async (
  userId: string,
  homeId: string
): Promise<boolean> => {
  try {
    const [data] = await db
      .select()
      .from(userHomes)
      .where(and(eq(userHomes.userId, userId), eq(userHomes.homeId, homeId)))
      .limit(1);

    return !!data;
  } catch {
    return false;
  }
};

// Function to mark a specific event as read
export const markEventAsRead = async (eventId: number): Promise<void> => {
  try {
    await db
      .update(eventLog)
      .set({ read: true })
      .where(eq(eventLog.id, eventId));
  } catch (err) {
    const error = err as Error;
    console.error("[markEventAsRead] Error:", error);
    throw error; // Re-throw to allow server action to handle it
  }
};

// User-home operations
export const createOrUpdateUserHomeConnection = async (
  userId: string,
  homeId: string,
  email: string
): Promise<void> => {
  try {
    const [existingConnection] = await db
      .select()
      .from(userHomes)
      .where(eq(userHomes.userId, userId))
      .limit(1);

    if (!existingConnection) {
      await db.insert(userHomes).values({
        userId,
        homeId,
        email,
        createdAt: new Date(),
      });
    }
  } catch (err) {
    const error = err as Error;
    throw error;
  }
};

export const createAlert = async (alert: Partial<AlertLog>) => {
  try {
    const [data] = await db
      .insert(alertLog)
      .values({
        homeId: alert.homeId!,
        userId: alert.userId ?? "system", // fallback if not provided
        deviceId: alert.deviceId,
        message: alert.message ?? "Critical alert!",
        sentStatus: alert.sentStatus ?? false,
        dismissed: alert.dismissed ?? false,
        createdAt: alert.createdAt ? new Date(alert.createdAt) : new Date(),
      })
      .returning();
    return { success: true, data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
};
