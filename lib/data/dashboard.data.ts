import {
  fetchAlertsByHomeId,
  fetchDevicesByHomeId,
  fetchRecentHomeEvents,
} from "@/db/db";
import { AlertLog, Device, EventLog } from "@/db/schema";
import { formatRelativeTime } from "@/lib/utils/date.util";
import {
  automationModes,
  DEFAULT_BRIGHTNESS,
  DEFAULT_TEMPERATURE,
} from "@/lib/utils/defaults.util";
import type {
  Activity,
  Alert,
  DashboardData,
  Light,
  SecurityPoint,
} from "@/types";

interface RawData {
  devices: Device[];
  events: EventLog[];
  alerts: AlertLog[];
}

/**
 * Fetches raw dashboard data using the db.ts data access layer
 */
export const fetchData = async (homeId: string): Promise<RawData> => {
  try {
    // db functions now return data directly or throw errors
    const [devices, events, alerts] = await Promise.all([
      fetchDevicesByHomeId(homeId),
      fetchRecentHomeEvents(homeId),
      fetchAlertsByHomeId(homeId),
    ]);

    // If any promise rejects, the catch block below will handle it.

    return { devices, events, alerts };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Re-throw or return default/empty state depending on requirements
    throw new Error(
      `Failed to fetch dashboard data: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

const transformToLight = (device: Device): Light => {
  return {
    id: device.id,
    homeId: device.homeId,
    name: device.name,
    location: device.location || "",
    mode: device.mode || "",
    isOn: device.currentState === "on",
    brightness: DEFAULT_BRIGHTNESS,
    temperature: DEFAULT_TEMPERATURE,
  };
};

const getSecurityPointType = (device: Device): "door" | "window" | "motion" => {
  return device.type.replace("_sensor", "") as "door" | "window" | "motion";
};

const transformToSecurityPoint = (device: Device): SecurityPoint => {
  const baseType = device.type.replace("_sensor", "") as
    | "door"
    | "window"
    | "motion";
  return {
    id: device.id,
    name: device.name,
    type: baseType,
    status: (device.currentState || "closed") as "open" | "closed",
    lastUpdated: device.lastUpdated?.toISOString() || "",
    icon: baseType === "motion" ? "device" : baseType,
  };
};

const transformToAlert = (
  alert: AlertLog,
  deviceNameMap: Record<string, string>
): Alert => {
  return {
    id: String(alert.id),
    type: alert.sentStatus ? "info" : "warning",
    message: alert.message,
    deviceName: deviceNameMap[alert.deviceId || ""] || "Unknown Device",
    timestamp: alert.createdAt?.toISOString() || new Date().toISOString(),
    deviceId: alert.deviceId || undefined,
  };
};

const transformToActivity = (
  event: EventLog,
  deviceNameMap: Record<string, string>
): Activity => {
  const deviceType = event.deviceId?.split("_")[0] || "unknown";
  const timestamp = event.createdAt?.toISOString() || new Date().toISOString();

  return {
    id: event.id,
    deviceId: event.deviceId || "",
    deviceName: deviceNameMap[event.deviceId || ""] || "Unknown Device",
    type: "device",
    eventType: event.eventType,
    action: event.eventType,
    target: deviceType,
    status: event.eventType === "state_change" ? "success" : "warning",
    displayTime: new Date(timestamp).toLocaleString(),
    relativeTime: formatRelativeTime(timestamp),
    details:
      event.oldState || event.newState
        ? {
            oldState: event.oldState || undefined,
            newState: event.newState || undefined,
          }
        : undefined,
    read: event.read || false,
  };
};

/**
 * Transforms raw data into dashboard format
 */
export const transformData = (
  rawData: RawData,
  homeId: string,
  userDisplayName: string
): DashboardData => {
  const { devices, events, alerts } = rawData;

  // deveice name mapping
  const deviceNameMap = devices.reduce(
    (acc, device) => {
      acc[device.id] = device.name;
      return acc;
    },
    {} as Record<string, string>
  );

  // Filter light devices and transform them to Light type
  const lightDevicesData = devices
    .filter((device) => device.type === "light")
    .map(transformToLight);

  // Get the current mode from any light device before transformation
  const deviceMode = lightDevicesData[0]?.mode || "";
  const currentMode =
    automationModes.find((mode) => mode.id === deviceMode)?.id || "";

  // ecurity points data
  const securityPointsData = devices
    .filter((device) => {
      const type = getSecurityPointType(device);
      return type === "door" || type === "window";
    })
    .map(transformToSecurityPoint);

  // Transform events to activities
  const activityData = events.map((event) =>
    transformToActivity(event, deviceNameMap)
  );

  // Transform alerts to match Alert type
  const alertsData = alerts.map((alert) =>
    transformToAlert(alert, deviceNameMap)
  );

  return {
    lightDevices: lightDevicesData,
    automationModes: [...automationModes],
    currentMode,
    securityPoints: securityPointsData,
    alerts: alertsData,
    activities: activityData,
    homeId,
    userDisplayName,
  };
};

/**
 * Returns default dashboard data when no data is available
 */
export const getDefaultDashboardData = (
  userDisplayName: string
): DashboardData => ({
  lightDevices: [],
  securityPoints: [],
  automationModes: [],
  currentMode: "",
  alerts: [],
  activities: [],
  homeId: "",
  userDisplayName,
});
