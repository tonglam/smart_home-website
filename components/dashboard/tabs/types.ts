export type AlertType = "warning" | "info" | "error";

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  timestamp: string;
  deviceId: string;
  deviceName: string;
}

export interface AlertsCardProps {
  alerts: Alert[];
  onClose: () => void;
  onDismissAlert?: (alertId: string) => void;
}

export interface CameraStatus {
  isOnline: boolean;
  batteryLevel: number;
  lastUpdate: string;
}
