import { UserResource } from "@clerk/types";

// =================== Auth Types ===================
/** @description User metadata stored in Clerk */
export interface UserMetadata {
  homeId?: string;
  // Add other metadata fields as needed
}

/** @description Authentication state returned by useAuth hook */
export interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  user: UserResource | null | undefined;
  metadata: UserMetadata;
  homeId: string | undefined;
  isHomeConnected: boolean;
}

/** @description Authentication actions returned by useAuth hook */
export interface AuthActions {
  signIn: () => void;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

/** @description Auth navigation state and actions */
export interface AuthNavigationState {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  isHomeConnected: boolean;
  homeId: string | undefined;
  showConnectHome: boolean;
  openConnectHome: () => void;
  closeConnectHome: () => void;
}

/** @description Session management state and actions */
export interface SessionState {
  timeLeft: number | null;
  showWarning: boolean;
  isActive: boolean;
  refreshSession: () => Promise<void>;
  dismissWarning: () => void;
}

// =================== Home Connection Types ===================
/** @description Home connection hook return type */
export interface UseHomeConnectionReturn {
  currentHomeId: string;
  isConnecting: boolean;
  isLoaded: boolean;
  handleConnect: (homeId: string) => Promise<void>;
  handleDisconnect: () => Promise<void>;
}

/** @description Connection error types */
export type ConnectionError = {
  code: "UNAUTHENTICATED" | "INVALID_HOME_ID" | "CONNECTION_FAILED";
  message: string;
};

// =================== MQTT Types ===================
/** @description MQTT hook return type */
export interface UseMqttReturn {
  isConnected: boolean;
  isConnecting: boolean;
  publish: (topic: string, message: string) => Promise<void>;
  subscribe: (
    topic: string,
    callback: (message: string) => void
  ) => Promise<void>;
  unsubscribe: (topic: string) => Promise<void>;
  error: Error | null;
}

// =================== Database Types ===================
/** @description Generic database hook return type */
export interface UseDbReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  mutate: () => Promise<void>;
}

// =================== User Types ===================
/** @description User management hook return type */
export interface UseUserReturn {
  userId: string;
  email: string | null;
  updateEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateHomeId: (
    homeId: string
  ) => Promise<{ success: boolean; error?: string }>;
}

// =================== Device Types ===================
/** @description Device management hook return type */
export interface UseDeviceReturn {
  deviceId: string;
  status: "online" | "offline" | "error";
  lastUpdate: Date;
  data: Record<string, unknown>;
  sendCommand: (command: string, payload: unknown) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

// =================== Cache Types ===================
/** @description Cache management hook return type */
export interface UseCacheReturn<T> {
  data: T | null;
  isStale: boolean;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  clear: () => void;
}

// =================== Notification Types ===================
/** @description Notification type */
export type NotificationType = "info" | "warning" | "error" | "success";

/** @description Notification object structure */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
}

/** @description Notification management hook return type */
export interface UseNotificationReturn {
  notifications: Notification[];
  addNotification: (type: NotificationType, message: string) => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}
