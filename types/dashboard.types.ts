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
  mode?: string;
  created_at?: string;
  last_updated?: string;
}
export type ActivityIconType = "device" | "security" | "system";
export type AlertSeverity = "warning" | "info" | "error";
export type SecurityPointIcon = "door" | "window" | "device";

export type Light = {
  id: string;
  homeId: string;
  name: string;
  location: string;
  mode: string;
  isOn: boolean;
  brightness: number;
  temperature: number;
};

export type LightState = {
  isOn: boolean;
  brightness: number;
  temperature: number;
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
  type: "door" | "window" | "motion";
  status: "open" | "closed";
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
