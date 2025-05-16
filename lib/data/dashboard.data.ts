import {
  db,
  fetchAlertsByHomeId,
  fetchDevicesByHomeId,
  fetchRecentHomeEvents,
  getHomeMode,
} from "@/db/db";
import {
  devices as devicesTable,
  type AlertLog,
  type Device,
  type EventLog,
} from "@/db/schema";
import { formatRelativeTime } from "@/lib/utils/date.util";
import { automationModes, DEFAULT_BRIGHTNESS } from "@/lib/utils/defaults.util";
import type {
  Activity,
  Alert,
  DashboardData,
  Light,
  SecurityPoint,
} from "@/types/dashboard.types";
import { and, eq } from "drizzle-orm";

interface RawData {
  devices: Device[];
  events: EventLog[];
  alerts: AlertLog[];
}

export const fetchData = async (homeId: string): Promise<RawData> => {
  try {
    const devicesPromise = fetchDevicesByHomeId(homeId);

    const eventsPromise = fetchRecentHomeEvents(homeId);

    const alertsPromise = fetchAlertsByHomeId(homeId);

    const [devices, events, alerts] = await Promise.all([
      devicesPromise,
      eventsPromise,
      alertsPromise,
    ]);

    return { devices, events, alerts };
  } catch (error) {
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
    location: device.location,
    isOn: device.currentState === "on",
    brightness: device.brightness || DEFAULT_BRIGHTNESS,
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

export const transformData = async (
  rawData: RawData,
  homeId: string,
  userId: string,
  userDisplayName: string
): Promise<DashboardData> => {
  const { devices, events, alerts } = rawData;

  // Get current mode from userHomes
  const currentMode = await getHomeMode(userId, homeId);

  // device name mapping
  const deviceNameMap = devices.reduce(
    (acc, device) => {
      acc[device.id] = device.name;
      return acc;
    },
    {} as Record<string, string>
  );

  const lightDevicesData = devices
    .filter((device) => device.type === "light")
    .map(transformToLight);

  // security points data
  const securityPointsData = devices
    .filter((device) => {
      const type = getSecurityPointType(device);
      return type === "door" || type === "window";
    })
    .map(transformToSecurityPoint);

  const activityData = events.map((event) =>
    transformToActivity(event, deviceNameMap)
  );

  const alertsData = alerts.map((alert) =>
    transformToAlert(alert, deviceNameMap)
  );

  const transformedData = {
    lightDevices: lightDevicesData,
    automationModes: [...automationModes],
    currentMode,
    securityPoints: securityPointsData,
    alerts: alertsData,
    activities: activityData,
    homeId,
    userDisplayName,
  };

  return transformedData;
};

export const getDefaultDashboardData = (
  userDisplayName: string
): DashboardData => ({
  lightDevices: [],
  securityPoints: [],
  automationModes: [...automationModes],
  currentMode: "home",
  alerts: [],
  activities: [],
  homeId: "",
  userDisplayName,
});

export async function getLightDevices(homeId: string): Promise<Device[]> {
  try {
    const result = await db
      .select()
      .from(devicesTable)
      .where(
        and(eq(devicesTable.homeId, homeId), eq(devicesTable.type, "light"))
      );
    return result;
  } catch (error) {
    console.error("Error in getLightDevices:", error);
    throw error;
  }
}

export async function getLightingData(homeId: string) {
  try {
    const lightDevicesData = await getLightDevices(homeId);

    return {
      devices: lightDevicesData.map((device) => ({
        id: device.id,
        name: device.name,
        type: device.type,
        location: device.location,
        currentState: device.currentState,
        brightness: device.brightness || DEFAULT_BRIGHTNESS,
      })),
    };
  } catch (error) {
    console.error("Error in getLightingData:", error);
    return {
      devices: [],
    };
  }
}
