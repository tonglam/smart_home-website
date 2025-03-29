import { cn } from "@/lib/utils/utils";
import { Activity, ActivityIconType } from "@/types/dashboard.types";
import { formatDistanceToNow } from "date-fns";
import { ActivityIcon } from "./ActivityIcon";
import { ActivityItemActions } from "./ActivityItemActions";

const mapEventTypeToIconType = (eventType: string): ActivityIconType => {
  if (eventType.includes("security") || eventType.includes("tampered")) {
    return "security";
  }
  if (eventType.includes("error") || eventType.includes("offline")) {
    return "system";
  }
  return "device";
};

const formatEventDescription = (activity: Activity): string => {
  let desc = `Type: ${activity.eventType}`;
  if (
    activity.details?.oldState !== null ||
    activity.details?.newState !== null
  ) {
    desc += ` | State: ${activity.details?.oldState ?? "N/A"} -> ${activity.details?.newState ?? "N/A"}`;
  }
  return desc;
};

interface ActivityItemProps {
  activity: Activity;
  onMarkAsRead: (id: number) => void;
  isPending: boolean;
}

export function ActivityItem({
  activity,
  onMarkAsRead,
  isPending,
}: ActivityItemProps) {
  const timeAgo = activity.displayTime
    ? formatDistanceToNow(new Date(activity.displayTime), { addSuffix: true })
    : "";

  return (
    <div
      className={cn(
        "relative group/item flex items-start gap-4 p-4 border-b last:border-0 bg-card/40 hover:bg-muted/50 transition-all duration-200 ease-in-out rounded-sm",
        activity.read && "opacity-60 hover:opacity-100"
      )}
    >
      <div className="mt-0.5">
        <ActivityIcon
          type={mapEventTypeToIconType(activity.eventType)}
          target={activity.target}
        />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-foreground/90">
              Device: {activity.deviceName}
            </h4>
            <p className="text-sm text-muted-foreground">
              {formatEventDescription(activity)}
            </p>
            {timeAgo && (
              <p className="text-xs text-muted-foreground/80">{timeAgo}</p>
            )}
          </div>

          <ActivityItemActions
            eventId={activity.id}
            isRead={!!activity.read}
            onMarkAsRead={onMarkAsRead}
            isPending={isPending}
          />
        </div>
      </div>
    </div>
  );
}
