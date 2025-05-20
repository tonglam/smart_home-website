import { automationModes } from "@/lib/utils/defaults.util";

/**
 * Core Types
 */

export interface DashboardDevice {
  id: string;
  name: string;
  type: string;
  location: string;
  current_state?: string;
  created_at?: string;
  last_updated?: string;
}

export type ActivityIconType = "device" | "security" | "system";
export type AlertSeverity = "warning" | "info" | "error";
export type SecurityPointIcon =
  | "door"
  | "window"
  | "device"
  | "reed_switch"
  | "camera"
  | "lux_sensor";

export type Light = {
  id: string;
  homeId: string;
  name: string;
  location: string;
  isOn: boolean;
  brightness: number;
};

export interface Camera {
  id: string;
  homeId: string;
  name: string;
  location: string;
  status: "online" | "offline";
}

export type LightState = {
  isOn: boolean;
  brightness: number;
};

/**
 * Data Types
 */
export interface Alert {
  id: string;
  type: AlertSeverity;
  message: string;
  deviceName: string;
  timestamp: string;
  deviceId?: string;
}

export interface SecurityPoint {
  id: string;
  name: string;
  type: "door" | "window" | "motion" | "reed_switch" | "camera" | "lux_sensor";
  status: string;
  lastUpdated: string;
  icon: SecurityPointIcon;
}

export interface Activity {
  id: number;
  deviceId: string;
  deviceName: string;
  type: "device" | "security" | "system";
  eventType: string;
  action: string;
  target: string;
  status: string;
  displayTime: string;
  relativeTime: string;
  details?: {
    oldState?: string;
    newState?: string;
  };
  read: boolean;
}

export type AutomationMode = (typeof automationModes)[number];

/**
 * Dashboard Data Structure
 */
export interface DashboardData {
  lightDevices: Light[];
  cameraDevices: Camera[];
  securityPoints: SecurityPoint[];
  automationModes: AutomationMode[];
  currentMode: string;
  alerts: Alert[];
  activities: Activity[];
  homeId: string;
  userDisplayName: string;
}

export type TabValue = "overview" | "monitoring" | "analytics";

export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export interface CameraMessage {
  timestamp: string;
  home_id: string;
  device_id: string;
  image_b64: string; // base64 encoded image
  format: string;
  resolution: string;
}
