/**
 * Event type constants for the smart home system.
 * These types are used to categorize and handle different events consistently
 * throughout the application, from device state changes to security alerts.
 */
export const EventTypes = {
  STATE_CHANGE: "state_change",
  SECURITY_ALERT: "security_alert",
  MODE_CHANGE: "mode_change",
  OFFLINE: "offline",
  ONLINE: "online",
  MOTION_DETECTED: "motion_detected",
  DOOR_OPEN: "door_open",
  DOOR_CLOSE: "door_close",
  SYSTEM_UPDATE: "system_update",
  ERROR: "error",
} as const;

export type EventType = (typeof EventTypes)[keyof typeof EventTypes];
