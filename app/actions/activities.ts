"use server";

import * as db from "@/lib/db";
import {
  ApiAlertLog,
  ApiEventLog,
  DbAlertLog,
  DbEventLog,
} from "@/lib/types/db.types";
import { formatDateTime, formatRelativeTime } from "@/lib/utils/date.util";
import { Activity, EVENT_TYPE_MAPPING } from "./types";
export type { Activity };

// Transform DB types to API types
function transformEventToApi(event: DbEventLog): ApiEventLog {
  return {
    ...event,
    id: event.id || 0,
    created_at: event.created_at || new Date().toISOString(),
  };
}

function transformAlertToApi(alert: DbAlertLog): ApiAlertLog {
  return {
    ...alert,
    id: alert.id || 0,
    created_at: alert.created_at || new Date().toISOString(),
  };
}

// Transform event log to activity
async function eventToActivity(event: ApiEventLog): Promise<Activity> {
  const device = await db.getDeviceById(event.device_id);
  const eventType = EVENT_TYPE_MAPPING[event.event_type.toLowerCase()] || {
    action: event.event_type.toLowerCase(),
    type: "device" as const,
    status: "success" as const,
  };

  return {
    id: `event_${event.id}`,
    type: eventType.type,
    action: eventType.action,
    target: device?.name || event.device_id,
    timestamp: event.created_at,
    displayTime: formatDateTime(event.created_at),
    relativeTime: formatRelativeTime(event.created_at),
    status: eventType.status,
    details:
      event.old_state || event.new_state
        ? {
            oldState: event.old_state,
            newState: event.new_state,
          }
        : undefined,
  };
}

// Transform alert to activity
async function alertToActivity(alert: ApiAlertLog): Promise<Activity> {
  const device = alert.device_id
    ? await db.getDeviceById(alert.device_id)
    : null;

  return {
    id: `alert_${alert.id}`,
    type: "security",
    action: "alert triggered",
    target: device?.name || "System",
    timestamp: alert.created_at,
    displayTime: formatDateTime(alert.created_at),
    relativeTime: formatRelativeTime(alert.created_at),
    status: "warning",
    details: {
      message: alert.message,
    },
  };
}

export async function getRecentActivities(
  homeId: string,
  limit = 50
): Promise<Activity[]> {
  try {
    // Only fetch events, not alerts
    const rawEvents = await db.getEvents(homeId, limit);
    const events = rawEvents.map(transformEventToApi);
    const eventActivities = await Promise.all(events.map(eventToActivity));

    // Sort by timestamp
    eventActivities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return eventActivities.slice(0, limit);
  } catch (error) {
    return [];
  }
}

// Get activities for a specific device
export async function getDeviceActivities(
  homeId: string,
  deviceId: string,
  limit = 20
): Promise<Activity[]> {
  try {
    // Verify device access
    const device = await db.getDeviceById(deviceId);
    if (!device || device.home_id !== homeId) {
      throw new Error("Device not found or unauthorized");
    }

    // Fetch device-specific events and alerts
    const [rawEvents, rawAlerts] = await Promise.all([
      db.getDeviceEvents(deviceId, limit),
      db.getAlerts(homeId),
    ]);

    // Transform to API types
    const events = rawEvents.map(transformEventToApi);
    const alerts = rawAlerts
      .map(transformAlertToApi)
      .filter((alert) => alert.device_id === deviceId);

    // Transform to activities
    const [eventActivities, alertActivities] = await Promise.all([
      Promise.all(events.map(eventToActivity)),
      Promise.all(alerts.map(alertToActivity)),
    ]);

    // Combine and sort by timestamp
    const allActivities = [...eventActivities, ...alertActivities];
    allActivities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Return limited number of activities
    return allActivities.slice(0, limit);
  } catch (error) {
    console.error("Failed to fetch device activities:", error);
    return [];
  }
}
