export interface Activity {
  id: string;
  type: "device" | "security" | "system";
  action: string;
  target: string;
  timestamp: string;
  displayTime: string;
  relativeTime: string;
  status: "success" | "warning" | "error";
  details?: {
    oldState?: string;
    newState?: string;
    message?: string;
  };
}

export type EventTypeMapping = Record<
  string,
  { action: string; type: Activity["type"]; status: Activity["status"] }
>;

// Default event type mappings
export const EVENT_TYPE_MAPPING: EventTypeMapping = {
  state_change: { action: "state changed", type: "device", status: "success" },
  security_alert: {
    action: "security alert",
    type: "security",
    status: "warning",
  },
  mode_change: { action: "mode changed", type: "system", status: "success" },
  offline: { action: "went offline", type: "device", status: "error" },
  online: { action: "came online", type: "device", status: "success" },
  motion_detected: {
    action: "detected motion",
    type: "security",
    status: "warning",
  },
  door_open: { action: "opened", type: "security", status: "warning" },
  door_close: { action: "closed", type: "security", status: "success" },
  system_update: { action: "updated", type: "system", status: "success" },
  error: { action: "encountered error", type: "system", status: "error" },
};
