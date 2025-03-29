import { cn } from "@/lib/utils/utils";
import type { AlertSeverity } from "@/types/dashboard.types";
import {
  HiExclamationCircle,
  HiExclamationTriangle,
  HiInformationCircle,
} from "react-icons/hi2";

const AlertIcon: Record<AlertSeverity, typeof HiExclamationCircle> = {
  warning: HiExclamationTriangle,
  info: HiInformationCircle,
  error: HiExclamationCircle,
};

const IconColors: Record<AlertSeverity, string> = {
  warning: "text-amber-500 dark:text-amber-400",
  info: "text-blue-500 dark:text-blue-400",
  error: "text-red-500 dark:text-red-400",
};

const BadgeColors: Record<AlertSeverity, string> = {
  warning: "bg-amber-100 dark:bg-amber-900/30",
  info: "bg-blue-100 dark:bg-blue-900/30",
  error: "bg-red-100 dark:bg-red-900/30",
};

interface AlertIconBadgeProps {
  type: AlertSeverity;
}

export function AlertIconBadge({ type }: AlertIconBadgeProps) {
  const Icon = AlertIcon[type];

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full p-1.5",
        BadgeColors[type]
      )}
      aria-hidden="true"
    >
      <Icon className={cn("h-4 w-4", IconColors[type])} />
    </div>
  );
}
