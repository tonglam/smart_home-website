import { cn } from "@/lib/utils/utils";
import type { Activity } from "@/types/dashboard.types";
import { HiCog, HiLightBulb, HiLockClosed } from "react-icons/hi";

interface ActivityIconProps {
  type: Activity["type"];
  target?: string;
}

export function ActivityIcon({ type, target = "" }: ActivityIconProps) {
  // Determine the icon based on type and target
  const getActivityIcon = () => {
    // Check if the target contains specific device types
    const targetLower = target.toLowerCase();

    if (targetLower.includes("light")) {
      return <HiLightBulb className="h-4 w-4" />;
    } else if (targetLower.includes("door") || targetLower.includes("window")) {
      return <HiLockClosed className="h-4 w-4" />;
    } else if (type === "device") {
      return <HiLightBulb className="h-4 w-4" />;
    } else if (type === "security") {
      return <HiLockClosed className="h-4 w-4" />;
    } else {
      return <HiCog className="h-4 w-4" />;
    }
  };

  // Determine the style based on type and target
  const getIconStyle = () => {
    const targetLower = target.toLowerCase();

    if (targetLower.includes("light")) {
      return "bg-blue-100/80 text-blue-600 ring-1 ring-blue-200/50";
    } else if (targetLower.includes("door") || targetLower.includes("window")) {
      return "bg-red-100/80 text-red-600 ring-1 ring-red-200/50";
    } else if (type === "device") {
      return "bg-blue-100/80 text-blue-600 ring-1 ring-blue-200/50";
    } else if (type === "security") {
      return "bg-red-100/80 text-red-600 ring-1 ring-red-200/50";
    } else {
      return "bg-purple-100/80 text-purple-600 ring-1 ring-purple-200/50";
    }
  };

  return (
    <div
      className={cn(
        "p-2 rounded-full transition-colors shadow-sm grid place-items-center",
        getIconStyle()
      )}
    >
      {getActivityIcon()}
    </div>
  );
}
