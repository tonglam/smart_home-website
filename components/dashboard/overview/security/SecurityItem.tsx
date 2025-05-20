import { Badge } from "@/components/ui/badge";
import type { SecurityPoint } from "@/types";
import {
  MdDeviceHub,
  MdDoorFront,
  MdLightbulbOutline,
  MdSensors,
  MdVideocam,
  MdWbSunny,
  MdWindow,
} from "react-icons/md";

interface SecurityItemProps {
  point: SecurityPoint;
}

const getStatusBadgeClasses = (status: string): string => {
  const s = status.toLowerCase();

  // Secure states (Green)
  if (
    [
      "closed",
      "secure",
      "no_motion",
      "off",
      "inactive",
      "none",
      "locked",
    ].includes(s)
  ) {
    return "bg-green-100 text-green-700 border-green-300 dark:bg-green-700 dark:text-green-100 dark:border-green-600";
  }

  // Insecure/Alert states (Red)
  if (
    [
      "open",
      "triggered",
      "alarm",
      "motion_detected",
      "unlocked",
      "breach",
      "unsafe",
    ].includes(s)
  ) {
    return "bg-red-100 text-red-700 border-red-300 dark:bg-red-700 dark:text-red-100 dark:border-red-600";
  }

  // Warning/Transitional states (Yellow)
  if (
    [
      "arming",
      "disarming",
      "pending",
      "low_battery",
      "tampered",
      "trouble",
      "jammed",
    ].includes(s)
  ) {
    return "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-600 dark:text-yellow-100 dark:border-yellow-500";
  }

  // Informational/Active states (Blue)
  if (["online"].includes(s)) {
    return "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-700 dark:text-blue-100 dark:border-blue-600";
  }

  // Offline/Unavailable (Slate Gray)
  if (["offline"].includes(s)) {
    return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500";
  }

  // Default for unknown/unavailable statuses (Slate Gray)
  return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500";
};

export function SecurityItem({ point }: SecurityItemProps) {
  const IconComponent = {
    door: MdDoorFront,
    window: MdWindow,
    motion: MdSensors,
    device: MdDeviceHub,
    reed_switch: MdSensors,
    camera: MdVideocam,
    lux_sensor: MdWbSunny,
    led_light: MdLightbulbOutline,
  }[point.icon];

  const ResolvedIcon = IconComponent || MdDeviceHub;

  return (
    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <ResolvedIcon className="h-4 w-4" />
        <span className="text-sm font-medium">{point.name}</span>
      </div>
      <Badge
        variant="outline"
        className={`${getStatusBadgeClasses(point.status)} capitalize px-2 py-0.5 text-xs`}
      >
        {point.status}
      </Badge>
    </div>
  );
}
