// Database Schema Types
export interface DbDevice {
  id: string;
  home_id: string;
  name: string;
  type: string;
  location?: string;
  mode?: string;
  current_state: string;
  created_at?: string;
  last_updated?: string;
  device_name?: string;
}

export interface DbEventLog {
  id?: number;
  home_id: string;
  device_id: string;
  event_type: string; // 'state_change'/'security_alert'/'mode_change'
  old_state?: string;
  new_state?: string;
  created_at?: string;
  device_name?: string;
}

export interface DbAlertLog {
  id?: number;
  home_id: string;
  user_id: string;
  device_id?: string;
  message: string;
  sent_status?: number;
  dismissed?: number;
  created_at?: string;
  device_name?: string;
}

export interface DbAutomationMode {
  id: string;
  home_id: string;
  name: string;
  icon: string;
  description: string;
  is_active: number;
  created_at?: string;
  last_updated?: string;
}

// API Response Types
export interface ApiDevice
  extends Omit<DbDevice, "created_at" | "last_updated"> {
  created_at: string;
  last_updated: string;
}

export interface ApiEventLog extends Omit<DbEventLog, "created_at"> {
  created_at: string;
}

export interface ApiAlertLog extends Omit<DbAlertLog, "created_at"> {
  created_at: string;
}

// Client Component Props Types
export interface DeviceProps {
  device: ApiDevice;
  onUpdate?: (deviceId: string, updates: Partial<ApiDevice>) => Promise<void>;
  onDelete?: (deviceId: string) => Promise<void>;
}

export interface EventLogProps {
  event: ApiEventLog;
}

export interface AlertLogProps {
  alert: ApiAlertLog;
  onStatusUpdate?: (alertId: number, status: number) => Promise<void>;
}

// Event Types
export type EventType =
  | "state_change"
  | "security_alert"
  | "mode_change"
  | "offline"
  | "online"
  | "motion_detected"
  | "door_open"
  | "door_close"
  | "system_update"
  | "error";

// Device Types
export type DeviceType =
  | "light"
  | "door_sensor"
  | "camera"
  | "window_sensor"
  | "thermostat"
  | "motion_sensor";
